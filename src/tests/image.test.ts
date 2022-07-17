/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { userService } from '../services';
import { app } from '../server';
import { userModel } from '../db/models/user-model';

let token: string;
const testImage = fs.readFileSync(path.join(__dirname, '/garbage.png'));

beforeAll(async () => {
  db.connect();
});
afterAll(() => db.close());

describe('Report Function', () => {
  test.only('이미지 업로드', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/images').send({ image: testImage });
    console.log(res);
    expect(res.statusCode).toBe(201);
  });
});
