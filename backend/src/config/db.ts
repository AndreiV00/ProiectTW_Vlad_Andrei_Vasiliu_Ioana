import * as mongoose from 'mongoose';
import 'dotenv/config';
//conectare la baza de date
const dbConnectionString = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

const connectToDB = async () => {
  try {
    await mongoose.connect(dbConnectionString);
    console.log('MongoDB connected');
  } catch (err) {
    console.log(`Can't connect to db: ${err}`);
    process.exit(1);
  }
};
export default connectToDB;