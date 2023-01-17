import * as mongoose from 'mongoose';
//schema bazei de date

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  bugs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bug',
    },
  ],
});

const User = mongoose.model('User', userSchema);
export default User;
