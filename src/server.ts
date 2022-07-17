import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import webSocket from './socket';
import { apiRouter } from './routers';
import { errorHandler } from './middlewares';

const app = express();

app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;
app.use(express.static(__dirname));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :date[web]'));

app.use('/api', apiRouter);
app.use(errorHandler);
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => console.log(`server is running ${PORT}`));
  webSocket(server);
}

// socket

export { app };
