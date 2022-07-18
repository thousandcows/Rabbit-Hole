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

const my = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'chss3339@gmail.com',
  githubProfileUrl: '프로필',
};

beforeAll(async () => {
  db.connect();
  const result = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
});
afterAll(() => db.close());

describe('Report Function', () => {
  test.only('이미지 업로드', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/images').attach('image', path.join(__dirname, '/garbage.png')).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
  });
});
