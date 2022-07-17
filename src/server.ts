import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import { ToadScheduler, SimpleIntervalJob, Task } from 'toad-scheduler';
import webSocket from './socket';
import { apiRouter } from './routers';
import { errorHandler } from './middlewares';
import { updateDatabase, client, fillDatabase } from './middlewares/redis';


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

// redis-connect
client.connect();

// toad-schedular: Redis => DB 정기 업데이트
const scheduler = new ToadScheduler();
const task = new Task('updateDatabase', async () => { await updateDatabase(); });
const job = new SimpleIntervalJob({ seconds: 5 }, task);

scheduler.addSimpleIntervalJob(job);

// socket

export { app };
