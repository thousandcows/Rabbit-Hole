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
const signUpMock = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'test10@test.com',
  githubProfileUrl: '프로필',
};

const cantsignUpMock = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
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
    githubAvatar: '아바타',
    githubEmail: 'test@test.com',
    githubProfileUrl: '프로필',
  });
  token = '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';
});
afterAll(() => db.close());

describe('Report Function', () => {
  test('이메일 조회 서비스 함수', async () => {
    jest.setTimeout(30000);
    expect(typeof userService.getUserByEmail).toBe('function');
  });
  test('회원가입 함수', async () => {
    jest.setTimeout(30000);
    expect(typeof userModel.create).toBe('function');
  });
  test('이메일 조회 모델 함수', async () => {
    jest.setTimeout(30000);
    expect(typeof userModel.findByEmail).toBe('function');
  });
  test('마이페이지 성공', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
  test('마이페이지 실패', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/users/mypage');
    expect(res.statusCode).toBe(401);
  });
  test.only('회원가입 성공', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').field(signUpMock).attach('authImage', path.join(__dirname, '/garbage.png'));

    expect(res.statusCode).toBe(201);
  });
  test('회원가입 실패', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').send(cantsignUpMock);
    expect(res.statusCode).toBe(404);
  });
});
