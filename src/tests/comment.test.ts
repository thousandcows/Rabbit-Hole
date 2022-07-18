/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { app } from '../server';
import { commentModel } from '../db/models/comment-model';

const redis = require('redis-mock');

let token: string;
let articleId: string;
let commentId: string;
let userId: string;

const my = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'chss3339@gmail.com',
  githubProfileUrl: '프로필',
};

const articleMock = {
  articleType: 'question',
  author: '신윤수',
  title: '테스트제목',
  content: '아라라랄',
  carrots: 20,
  tags: [{ name: 'react' }, { name: '디코' }],
};

const commentMock = {
  commentType: 'question',
  content: '댓글 작성',
};

const updateMock = {
  commentType: 'project',
  content: '댓글 업데이트',
};

const adoptionMock = {
  isAdopted: true,
};
beforeAll(async () => {
  db.connect();
  // 테스트 시작 전 테스트db에 유저정보 저장
  const client = redis.createClient();
  const user = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  const article = await request(app).post('/api/articles/').send(articleMock).set('Authorization', `Bearer ${token}`);
  articleId = article.body._id;
  userId = user.body._id;
});
afterAll(() => {
  db.close();
  redis.quit();
});

describe('comment-router 댓글 API 테스트', () => {
  test('댓글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post(`/api/comments/${articleId}`).send(commentMock).set('Authorization', `Bearer ${token}`);
    commentId = res.body._id;
    console.log(res.body);
    expect(res.statusCode).toBe(201);
  });

  test('댓글 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get(`/api/comments/${articleId}`);
    expect(res.statusCode).toBe(200);
  });

  test('댓글 수정', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post(`/api/comments/${commentId}`).send(updateMock).set('Authorization', `Bearer ${token}`);
    expect(res.body.commentType).toBe('project');
  });
  test('댓글 채택', async () => {
    jest.setTimeout(30000);
    const res = await request(app).put(`/api/comments/${commentId}/adoption`).send(adoptionMock).set('Authorization', `Bearer ${token}`);
    expect(res.body.isAdopted).toBe(true);
  });

  test('댓글 하나 삭제', async () => {
    try {
      jest.setTimeout(30000);
      const res = await request(app).delete(`/api/comments/${commentId}`).set('Authorization', `Bearer ${token}`);
      const deletedComment = await commentModel.findById(commentId);
    } catch (error) {
      const errorMock = new Error('댓글이 존재하지 않습니다.');
      errorMock.name = 'NotFound';
      expect(error).toEqual(errorMock);
    }
  });
});
