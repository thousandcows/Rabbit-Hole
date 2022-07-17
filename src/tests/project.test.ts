/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { userService } from '../services';
import { app } from '../server';
import { userModel } from '../db/models/user-model';

interface tagsType {
    [key: string]: string;
}

let token: string;
let articleId: string;
let commentId: string;
let userId: string;

const projectMock = {
  author: '신윤수',
  title: '프로젝트',
  shortDescription: '소개글',
  description: '내용',
};
const tags: tagsType[] = [{ name: 'nestjs' }];

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
  shortDescription: '업데이트',
  description: '업데이트',
};

beforeAll(async () => {
  db.connect();
  // 테스트 시작 전 테스트db에 유저정보 저장
  const user = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  userId = user.body._id;
});
afterAll(() => db.close());

describe('project-router 프로젝트 게시판 API 테스트', () => {
  test.only('프로젝트 게시글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/projects')
      .field(projectMock)
      .field('tags', JSON.stringify(tags))
      .attach('thumbnail', path.join(__dirname, '/garbage.png'))
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
  });
//   test('회원가입 실패', async () => {
//     jest.setTimeout(30000);
//     const res = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
//     expect(res.statusCode).toBe(409);
//   });
//   test('마이페이지 - 게시글 조회 성공', async () => {
//     jest.setTimeout(30000);
//     const myinfo = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);
//     const res = await request(app).get(`/api/users/${myinfo.body._id}/articles`).set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//   });
//   test('마이페이지 - 프로젝트 조회 성공', async () => {
//     jest.setTimeout(30000);
//     const myinfo = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);
//     const res = await request(app).get(`/api/users/${myinfo.body._id}/projects`).set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//   });
//   test('회원정보 수정', async () => {
//     jest.setTimeout(30000);
//     const res = await request(app).put('/api/users').send(updateMock).set('Authorization', `Bearer ${token}`);
//     expect(res.body.track).toBe('AI트랙');
//     expect(res.body.trackCardinalNumber).toBe(5);
//   });
//   test('이메일로 회원 조회', async () => {
//     jest.setTimeout(30000);
//     const res = await request(app).get('/api/users/chss3339@gmail.com').set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//   });
//   test('회원탈퇴', async () => {
//     jest.setTimeout(30000);
//     const res = await request(app).delete('/api/users').set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//   });
});
