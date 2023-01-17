import app from './app';
import { SERVER_PORT } from './config/constants';

app.listen(SERVER_PORT, () =>
  console.log('application started on port: ', SERVER_PORT)
);
