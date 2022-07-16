/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

import request from 'supertest';
import * as db from './utils/db';
import { userService } from '../services';
import { app } from '../server';
import { userModel } from '../db/models/user-model';

let token: string;

const signUpMock = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  authImage: '이미지',
  githubAvatar: '아바타',
  githubEmail: 'test10@test.com',
  githubProfileUrl: '프로필',
};

const cantsignUpMock = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  authImage: '이미지',
  githubAvatar: '아바타',
  githubEmail: 'test@test.com',
  githubProfileUrl: '프로필',
};

beforeAll(async () => {
  db.connect();
  const result = await request(app).post('/api/users/register').send({
    name: 'jest1',
    track: 'SW트랙',
    trackCardinalNumber: 1,
    position: '프론트엔드',
    authImage: '이미지',
    githubAvatar: '아바타',
    githubEmail: 'test@test.com',
    githubProfileUrl: '프로필',
  });
  token = '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';
});
afterAll(() => db.close());

describe('Report Function', () => {
  test('should have a DiaryService.create function', async () => {
    jest.setTimeout(30000);
    expect(typeof userService.getUserByEmail).toBe('function');
  });
  test('should have a DiaryService.create function', async () => {
    jest.setTimeout(30000);
    expect(typeof userModel.create).toBe('function');
  });
  test('should have a DiaryService.create function', async () => {
    jest.setTimeout(30000);
    expect(typeof userModel.findByEmail).toBe('function');
  });
  test('should return 200 response code', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
  test('should return 404 response code', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/users/mypage');
    expect(res.statusCode).toBe(401);
  });
  test('should return 200 response code', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').send(signUpMock);
    expect(res.statusCode).toBe(200);
  });
  test('should return 200 response code with false', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').send(cantsignUpMock);
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe(false);
  });
});
