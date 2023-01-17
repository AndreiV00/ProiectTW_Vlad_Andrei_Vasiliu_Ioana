import express from 'express';
import connectToDB from './config/db';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bugsRouter from './routes/bugsRoutes';
import projectsRouter from './routes/projectsRoutes';
import userRouter from './routes/userRoutes';
import cors from 'cors';

connectToDB();
const app = express();

const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', bugsRouter, projectsRouter, userRouter);

export default app;
