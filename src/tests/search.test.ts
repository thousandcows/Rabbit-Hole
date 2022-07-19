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

const projectMock = {
  author: '신윤수',
  title: '프로젝트',
  shortDescription: '소개글',
  description: '내용',
};

const projectMock2 = {
  author: '신윤수2',
  title: '프로젝트2',
  shortDescription: '소개글2',
  description: '내용2',
};

const tags: tagsType[] = [{ name: 'nestjs' }];

const articleMock = {
  articleType: 'question',
  title: '게시판',
  content: '내용',
  carrots: 20,
  author: '도라에몽',
};

const articleMock2 = {
  articleType: 'question',
  title: '게시판2',
  content: '내용2',
  carrots: 40,
  author: '도라에몽2',
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

beforeAll(async () => {
  db.connect();

  // 테스트 시작 전 테스트db에 유저정보 저장
  const user = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  const project = await request(app).post('/api/projects')
    .field(projectMock)
    .field('tags', JSON.stringify(tags))
    .attach('thumbnail', path.join(__dirname, '/garbage.png'))
    .set('Authorization', `Bearer ${token}`);
  const project2 = await request(app).post('/api/projects')
    .field(projectMock2)
    .field('tags', JSON.stringify(tags))
    .attach('thumbnail', path.join(__dirname, '/garbage.png'))
    .set('Authorization', `Bearer ${token}`);
  await request(app).get(`/api/projects/${project2.body._id}`);
  await request(app).get(`/api/projects/${project2.body._id}`);
  await request(app).get(`/api/projects/${project2.body._id}`);
  const article = await request(app).post('/api/articles')
    .send(articleMock)
    .set('Authorization', `Bearer ${token}`);
  const article2 = await request(app).post('/api/articles')
    .send(articleMock2)
    .set('Authorization', `Bearer ${token}`);
  await request(app).get(`/api/articles/${article2.body._id}`);
  await request(app).get(`/api/articles/${article2.body._id}`);
  await request(app).get(`/api/articles/${article2.body._id}`);
});
afterAll((done) => {
  db.close();
  jest.clearAllMocks();
  client.flushall(done);
});

describe('project-router 프로젝트 게시판 API 테스트', () => {
  describe('게시글 검색', () => {
    test('게시글 검색 - 작성자 - 조회순', async () => {
      const res = await request(app)
        .get('/api/search/articles')
        .query({
          author: '도라에몽',
          articleType: 'question',
          filter: 'views',
          page: 1,
          perPage: 2,
        });
      expect(res.body.articleList[0].views).toBeGreaterThan(res.body.articleList[1].views);
      expect(res.body.totalPage).toBe(1);
    });
    test('게시글 검색 - 작성자 - 최신순', async () => {
      const res = await request(app)
        .get('/api/search/articles')
        .query({
          author: '도라에몽',
          articleType: 'question',
          filter: 'date',
          page: 1,
          perPage: 2,
        });
      const first = new Date(res.body.articleList[0].createdAt).getTime();
      const second = new Date(res.body.articleList[1].createdAt).getTime();
      expect(first).toBeGreaterThan(second);
      expect(res.body.totalPage).toBe(1);
    });
    test('게시글 검색 - 제목 - 조회순', async () => {
      const res = await request(app)
        .get('/api/search/articles')
        .query({
          title: '게시판',
          articleType: 'question',
          filter: 'views',
          page: 1,
          perPage: 2,
        });
      expect(res.body.articleList[0].views).toBeGreaterThan(res.body.articleList[1].views);
      expect(res.body.totalPage).toBe(1);
    });
    test('게시글 검색 - 제목 - 최신순', async () => {
      const res = await request(app)
        .get('/api/search/articles')
        .query({
          title: '게시판',
          articleType: 'question',
          filter: 'date',
          page: 1,
          perPage: 2,
        });
      const first = new Date(res.body.articleList[0].createdAt).getTime();
      const second = new Date(res.body.articleList[1].createdAt).getTime();
      expect(first).toBeGreaterThan(second);
      expect(res.body.totalPage).toBe(1);
    });
  });
  describe('프로젝트 검색', () => {
    test('프로젝트 검색 - 작성자 - 조회순', async () => {
      const res = await request(app)
        .get('/api/search/projects')
        .query({
          author: '신윤수',
          filter: 'views',
          page: 1,
          perPage: 2,
        });
      expect(res.body.articleList[0].views).toBeGreaterThan(res.body.articleList[1].views);
      expect(res.body.totalPage).toBe(1);
    });
    test('프로젝트 검색 - 작성자 - 최신순', async () => {
      const res = await request(app)
        .get('/api/search/projects')
        .query({
          author: '신윤수',
          filter: 'date',
          page: 1,
          perPage: 2,
        });
      const first = new Date(res.body.articleList[0].createdAt).getTime();
      const second = new Date(res.body.articleList[1].createdAt).getTime();
      expect(first).toBeGreaterThan(second);
      expect(res.body.totalPage).toBe(1);
    });
    test('게시글 검색 - 제목 - 조회순', async () => {
      const res = await request(app)
        .get('/api/search/projects')
        .query({
          title: '프로젝트',
          filter: 'views',
          page: 1,
          perPage: 2,
        });
      console.log(res.body);
      expect(res.body.projectList[0].views).toBeGreaterThan(res.body.projectList[1].views);
      expect(res.body.totalPage).toBe(1);
    });
    test('게시글 검색 - 제목 - 최신순', async () => {
      const res = await request(app)
        .get('/api/search/projects')
        .query({
          title: '프로젝트',
          filter: 'date',
          page: 1,
          perPage: 2,
        });
      const first = new Date(res.body.projectList[0].createdAt).getTime();
      const second = new Date(res.body.projectList[1].createdAt).getTime();
      expect(first).toBeGreaterThan(second);
      expect(res.body.totalPage).toBe(1);
    });
  });
});
