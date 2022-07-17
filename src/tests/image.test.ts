/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { app } from '../server';

let token: string;
let testImage: any;

beforeAll(async () => {
  db.connect();
  testImage = fs.readFileSync(path.join(__dirname, '/garbage.png'));
});
afterAll(() => db.close());

describe('Report Function', () => {
  test.only('이미지 업로드', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/images').attach('image', path.join(__dirname, '/garbage.png'));
    // console.log(res);
    expect(res.statusCode).toBe(201);
  });
});
