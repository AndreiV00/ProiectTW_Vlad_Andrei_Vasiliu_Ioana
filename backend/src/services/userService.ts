import * as express from 'express';
import User from '../models/user';
import * as bcrypt from 'bcrypt';
import { ROUNDS_OF_SALT } from '../config/constants';
import * as jwt from 'jsonwebtoken';
import { JWT_VALIDITY_SECONDS, ROLES } from '../config/constants';

//TODO ERROR HANDLING
const registerUser = async (req: express.Request, res: express.Response) => {
  const { name, email, password } = req.body;

  //check if the email is already used
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    return res.status(409).json('Email already used');
  }

  // Hash the password using bcrypt
  const encrypteddPass = await bcrypt.hash(password, ROUNDS_OF_SALT);

  // Store the new user in the database
  const user = new User({ name, email, password: encrypteddPass });
  user.role = ROLES.None; //asign no role by default

  user.save((err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
  });

  // Create token
  const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
    expiresIn: JWT_VALIDITY_SECONDS,
  });
  return res
    .json({ message: 'Successfully registered new user!', token });
};

//Login User Method
//TODO Error Handling
//TODO Refactor
const loginUser = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = user.password;
  var result = await bcrypt.compare(password, hashedPassword);
  if (!result) {
    return res.status(500).send({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { user_id: user._id, user_name: user.name, role: user.role },
    process.env.TOKEN_KEY,
    {
      expiresIn: JWT_VALIDITY_SECONDS,
    }
  );

  return res
    .json({ message: 'Successfully loged in!', token, user_details:{userName: user.name, userId: user._id, userRole: user.role}});
};

export { registerUser, loginUser };
