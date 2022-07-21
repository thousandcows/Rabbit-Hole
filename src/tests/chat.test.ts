/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { app } from '../server';
import { chatService } from '../services';

let token: string;
let userId: string;

const userInfo = {
  name: 'jest1',
  track: 'SW트랙',
  trackCardinalNumber: 1,
  position: '프론트엔드',
  githubAvatar: '아바타',
  githubEmail: 'chss3339@gmail.com',
  githubProfileUrl: '프로필',
};

const chatMock = {
  senderId: 'milmil',
  profile: 'profile string',
  name: 'cow',
  track: 'SW트랙',
  trackCardinalNumber: 2,
  roomType: 'main',
  chat: 'I like socket.io',
  time: '20:33',
  image: 'no image',
}

beforeAll(async () => {
  db.connect();
  await request(app).post('/api/users/register').field(userInfo).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
  await chatService.addChat(chatMock);
});
afterAll(() => {
  db.close();
});

describe('article-router 게시판 API 테스트', () => {
  test('채팅 내역 조회', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/chats').query({ page: 1, perPage: 10 }).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalPage).toBeGreaterThanOrEqual(1);
  });
});
