import * as express from 'express';
import { ROLES } from '../config/constants';
import * as jwt from 'jsonwebtoken';

//TODO de rezolvat de ce ii ia asa mult sa raspunda daca nu are cookie requestul - fixed :*
const isLogedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  const authHeader = req?.headers.authorization;
  const token = authHeader?.split(' ')[1]

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).json({ error: 'You are not authenticated' });
  }

  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).json({ error: 'You are not authenticated' });
    }
    // otherwise, return a bad request error
    return res.status(400).json({ error: 'Bad request' });
  }
  //Adding role and userid to the request params
  req.body.role = payload.role;
  req.body.user_id = payload.user_id;
  return next();
};

export { isLogedIn };
