import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import webSocket from './socket';
import { apiRouter } from './routers/api';

const app = express();
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

const { PORT } = process.env;

app.get('/', (req: any, res: any) => {
  // eslint-disable-next-line no-path-concat, prefer-template
  res.sendFile(__dirname + '/index.html');
});

app.use('/api', apiRouter);

const server = app.listen(PORT, () => console.log(`server is running ${PORT}`));

// socket
webSocket(server);
