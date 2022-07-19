/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { app } from '../server';

beforeAll(async () => {
  db.connect();
});
afterAll(() => {
  db.close();
});

describe('article-router 게시판 API 테스트', () => {
  test('채팅 내역 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/chats').query({ page: 1, perPage: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.totalPage).toBeGreaterThanOrEqual(0);
  });
});
