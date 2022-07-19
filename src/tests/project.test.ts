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

jest.mock('redis', () => jest.requireActual('redis-mock'));
const client = redis.createClient();
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
const updateMock = {
  author: '신윤수',
  title: '업데이트프로젝트',
  shortDescription: '업데이트프로젝트',
  description: '업데이트프로젝트',
};

const keyvalue = `{
  “_id”: “62cfc1d83798b73fe5bd9cff”,
  “title”: “제목”,
  “author”: “이지은2”,
  “authorId”: “62c8691b1673e09fbcfa4298”,
  “shortDescription”: “짧은설명”,
  “description”: “설명”,
  “thumbnail”: “https://rabbit-hole-image.s3.ap-northeast-2.amazonaws.com/ff39c13d32b21c4fdc757cb00e4e813f",
  “views”: 622,
  “tags”: [
  {
  “name”: “오잉13”
  }
  ],
  “likes”: [],
  “createdAt”: “2022-07-14T07:12:24.550Z”,
  “updatedAt”: “2022-07-19T11:12:06.265Z”,
  “__v”: 0,
  “comments”: [
  {
  “commentId”: “62d55d6e52e8ad7f392c7549”
  },
  {
  “commentId”: “62d55d8052e8ad7f392c768b”
  },
  {
  “commentId”: “62d560d952e8ad7f392cabe4”
  }
  ]
  }`;
beforeAll(async () => {
  db.connect();
  client.set('project:62cfc1d83798b73fe5bd9cff', `${keyvalue}`, () => {
    client.get('project:62cfc1d83798b73fe5bd9cff', (err:any, redisValue: any) => {
      console.log('비포', redisValue);
      expect(redisValue).toBe(keyvalue);
    });
  });
  // 테스트 시작 전 테스트db에 유저정보 저장
  const user = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  userId = user.body._id;
});
afterAll((done) => {
  db.close();
  jest.clearAllMocks();
  client.flushall(done);
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
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
  });
  test('게시글 수정', async () => {
    jest.setTimeout(30000);
    const res = await request(app).put(`/api/projects/${projectId}`)
      .field(updateMock)
      .field('tags', JSON.stringify(tags))
      .attach('thumbnail', path.join(__dirname, '/garbage.png'))
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.title).toBe('업데이트프로젝트');
    expect(res.body.shortDescription).toBe('업데이트프로젝트');
    expect(res.body.description).toBe('업데이트프로젝트');
  });
  test('게시글 삭제', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete(`/api/projects/${projectId}`).set('Authorization', `Bearer ${token}`);
    expect(res.body._id).toBe(projectId);
  });
});
