/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import path from 'path';
import request from 'supertest';
import * as db from './utils/db';
import { userService } from '../services';
import { app } from '../server';

let token: string;

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
  const result = await request(app).post('/api/users/register').field(my).attach('authImage', path.join(__dirname, '/garbage.png'));
  token = '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';
});

describe('auth-router 깃허브 API 테스트', () => {
  test('깃허브 로그인 url', async () => {
    jest.setTimeout(30000);
    const res = await request(app).get('/api/auth/github/login');
    expect(res.headers.location).toContain('https://github.com/login/oauth/authorize');
  });
//   test('깃허브 로그인 callback url', async () => {
//     jest.setTimeout(30000);
//     const res = await request(app).get('/api/auth/github/login');
//     const callbackUrl = res.headers.location;
//     Object.assign(location, { host: 'www.newhost.com', pathname: 'file.txt' });
//   });
});
