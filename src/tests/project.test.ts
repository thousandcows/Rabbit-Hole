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

const redis = require('redis-mock');

interface tagsType {
    [key: string]: string;
}

let token: string;
let projectId: string;
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

const commentMock = {
  commentType: 'project',
  content: '댓글 작성',
};

const updateMock = {
  shortDescription: '업데이트',
  description: '업데이트',
};

beforeAll(async () => {
  db.connect();
  const client = redis.createClient();
  // 테스트 시작 전 테스트db에 유저정보 저장
  const user = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  userId = user.body._id;
});
afterAll(() => {
  db.close();
  redis.quit();
});

describe('project-router 프로젝트 게시판 API 테스트', () => {
  test('프로젝트 게시글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/projects')
      .field(projectMock)
      .field('tags', JSON.stringify(tags))
      .attach('thumbnail', path.join(__dirname, '/garbage.png'))
      .set('Authorization', `Bearer ${token}`);
    projectId = res.body._id;
    console.log(res.body);
    expect(res.statusCode).toBe(201);
  });
  test('전체 게시글 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/projects').query({ page: 1, perPage: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.projectList.length).toBe(1);
    expect(res.body.totalPage).toBe(1);
  });
  test('게시글 조회', async () => {
    jest.setTimeout(30000);
    const comRes = await request(app).post(`/api/comments/${projectId}`).send(commentMock).set('Authorization', `Bearer ${token}`);
    commentId = comRes.body._id;
    const res = await request(app).get(`/api/projects/${projectId}`);
    console.log(res.body);
    expect(res.body.projectInfo.comments.length).toBe(1);
  });
  // test('게시글 수정', async () => {
  //   jest.setTimeout(30000);
  //   const myinfo = await request(app).get('/api/users/mypage').set('Authorization', `Bearer ${token}`);
  //   const res = await request(app).get(`/api/users/${myinfo.body._id}/projects`).set('Authorization', `Bearer ${token}`);
  //   expect(res.statusCode).toBe(200);
  // });
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
