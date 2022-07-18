/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { articleService } from '../services';
import { app } from '../server';
import { articleModel } from '../db/models/article-model';

interface tagsType {
    [key: string]: string;
}

let token: string;
let articleId: string;
let commentId: string;
let userId: string;

const articleMock = {
  articleType: 'question',
  author: 'milcam',
  title: 'i love redis',
  content: 'i have no energy',
  carrots: 100,
};

const tags: tagsType[] = [{ name: 'cow' }];

const userInfo = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'chss3339@gmail.com',
  githubProfileUrl: '프로필',
};

const commentMock = {
  commentType: 'question',
  content: '정말 좋은 게시글이네요!',
};

const updateMock = {
  title: 'I don\'t love redis-mock',
  content: '정말 좋은 게시글이네요!!!!!!!!',
  tags: [
    { name: '배고파' }, { name: '배불러' }, { name: '안 배고파' },
  ],
};

beforeAll(async () => {
  db.connect();
  const user = await request(app).post('/api/users/register').field(userInfo).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  userId = user.body._id;
});
afterAll(() => {
  db.close();
});

describe('article-router 게시판 API 테스트', () => {
  test('새 게시글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/articles')
      .field(articleMock)
      .field('tags', JSON.stringify(tags))
      .set('Authorization', `Bearer ${token}`);
    articleId = res.body._id;
    expect(res.statusCode).toBe(201);
  });
  test('전체 게시글 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/articles').query({ articleType: 'question', page: 1, perPage: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.articleList.length).toBe(10);
    expect(res.body.totalPage).toBe(1);
  });
  test('상세 페이지 조회', async () => {
    jest.setTimeout(30000);
    const commentRes = await request(app).post(`/api/comments/${articleId}`).send(commentMock).set('Authorization', `Bearer ${token}`);
    commentId = commentRes.body._id;
    const res = await request(app).get(`/api/articles/${articleId}`);
    expect(res.body.articleInfo.comments.length).toBe(1);
  });
  test('게시글 수정', async () => {
    jest.setTimeout(30000);
    const res = await request(app).put(`/api/articles/${articleId}`).send(updateMock).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  // 5. 게시글 삭제
  test('게시글 삭제', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete(`/api/articles/${articleId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  // 6. 게시글 좋아요
});
