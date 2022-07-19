import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { app } from '../server';

let token: string;
let adminId: string;
let userId: string;
let userToken: string;
let articleId: string;
let commentId: string;
let projectId: string;

interface tagsType {
  [key: string]: string;
}

const adminInfo = {
  name: '관리자',
  track: 'AI트랙',
  trackCardinalNumber: 0,
  position: '풀스택',
  githubAvatar: '관리자',
  githubEmail: 'chimchim@gmail.com',
  githubProfileUrl: '프로필 주소',
};

const userInfo = {
  name: '유저',
  track: 'SW트랙',
  trackCardinalNumber: 3,
  position: '기획자',
  githubAvatar: '유저',
  githubEmail: 'chimch@gmail.com',
  githubProfileUrl: '프로필 주소',
};

const updateMock = {
  role: 'racer'
}

const articleMock = {
  articleType: 'question',
  author: 'milcam',
  title: 'i love redis',
  content: 'i have no energy',
  carrots: 100,
};

const tags: tagsType[] = [{ name: 'cow' }];

const commentMock = {
  commentType: 'question',
  content: '댓글 작성',
};

const projectMock = {
  author: '신윤수',
  title: '프로젝트',
  shortDescription: '소개글',
  description: '내용',
};

beforeAll(async () => {
  db.connect();
  const admin = await request(app).post('/api/users/register').field(adminInfo).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  adminId = admin.body._id;
  const user = await request(app).post('/api/users/register').field(userInfo).attach('authImage', path.join(__dirname, '/garbage.png'));
  userToken = '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';
  userId = user.body._id;
});
afterAll(() => {
  db.close();
});

describe('관리자 기능 테스트', async () => {
  // 전체 유저 조회
  test('전체 유저 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/admin/users').query({ page: 1, perPage: 10 }).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.userList.length).toBe(1);
    expect(res.body.totalPage).toBe(1);
  });
  test('유저 가입 승인', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post(`/api/admin/users/${userId}`).send(updateMock).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('새 게시글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/articles')
      .field(articleMock)
      .field('tags', JSON.stringify(tags))
      .set('Authorization', `Bearer ${userToken}`);
    articleId = res.body._id;
    expect(res.statusCode).toBe(201);
  });
  test('댓글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post(`/api/comments/${articleId}`).send(commentMock).set('Authorization', `Bearer ${userToken}`);
    commentId = res.body._id;
    expect(res.statusCode).toBe(201);
  });
  test('프로젝트 게시글 작성', async () => {
    jest.setTimeout(30000);
    const res = await request(app).post('/api/projects')
      .field(projectMock)
      .field('tags', JSON.stringify(tags))
      .attach('thumbnail', path.join(__dirname, '/garbage.png'))
      .set('Authorization', `Bearer ${userToken}`);
    projectId = res.body._id;
    expect(res.statusCode).toBe(201);
  });
  test('전체 프로젝트 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/admin/projects').query({ page: 1, perPage: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.projectList.length).toBe(1);
    expect(res.body.totalPage).toBe(1);
  });
  test('프로젝트 삭제', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete(`/api/admin/projects/${projectId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
});
  test('댓글 삭제', async () => {
      jest.setTimeout(30000);
      const res = await request(app).delete(`/api/admin/comments/${commentId}`).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
  });
  test('게시글 삭제', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete(`/api/admin/articles/${articleId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('유저 삭제', async () => {
    jest.setTimeout(30000);
    const res = await request(app).delete(`/api/admin/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});