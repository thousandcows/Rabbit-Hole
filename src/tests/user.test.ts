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

const my = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'chss3339@gmail.com',
  githubProfileUrl: '프로필',
};

const updateMock = {
  track: 'AI트랙',
  trackCardinalNumber: 5,
};

beforeAll(async () => {
  db.connect();
  // 테스트 시작 전 테스트db에 유저정보 저장
  const result = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
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
  test('회원가입 성공', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').field(signUpMock).attach('authImage', path.join(__dirname, '/garbage.png'));

    expect(res.statusCode).toBe(201);
  });
  test('회원가입 실패', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
    expect(res.statusCode).toBe(409);
  });
  test('마이페이지 - 게시글 조회 성공', async () => {
    jest.setTimeout(30000);
    const myinfo = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);
    const res = await request(app).get(`/api/users/${myinfo.body._id}/articles`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('마이페이지 - 프로젝트 조회 성공', async () => {
    jest.setTimeout(30000);
    const myinfo = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);
    const res = await request(app).get(`/api/users/${myinfo.body._id}/projects`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('회원정보 수정', async () => {
    jest.setTimeout(30000);
    const res = await request(app).put('/api/users').send(updateMock).set('Authorization', `Bearer ${token}`);
    expect(res.body.track).toBe('AI트랙');
    expect(res.body.trackCardinalNumber).toBe(5);
  });
  test('이메일로 회원 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/users/chss3339@gmail.com').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('회원탈퇴', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
