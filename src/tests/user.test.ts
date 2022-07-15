/* eslint-disable no-undef */
import * as db from './utils/db';
import { userService } from '../services';

beforeAll(() => db.connect());
afterAll(() => db.close());

describe('회원가입 TEST', () => {
  test('회원가입 성공', async () => {
    const user = await userService.addUser({
      name: 'jest1',
      track: 'SW트랙',
      trackCardinalNumber: 1,
      position: '프론트엔드',
      authImage: '이미지',
      githubAvatar: '아바타',
      githubEmail: 'test@test.com',
      githubProfileUrl: '프로필',
    });

    expect(user).toEqual('jesthard');
  });

  test('회원가입 실패 - 중복 이메일', async () => {
    await expect(
      userService.addUser({
        name: 'jest1',
        track: 'SW트랙',
        trackCardinalNumber: 1,
        position: '프론트엔드',
        authImage: '이미지',
        githubAvatar: '아바타',
        githubEmail: 'chss3339@gmail.com',
        githubProfileUrl: '프로필',
      }),
    ).rejects.toThrow(
      '이 아이디는 현재 사용중입니다. 다른 아이디를 입력해주세요.',
    );
  });
});

// describe('로그인 TEST', () => {
//   test('로그인 성공', async () => {
//     const userToken = await userService.getUserToken({
//       userId: 'jest1',
//       password: '1234',
//     });

//     expect(userToken).not.toBeNull();
//   });

//   test('로그인 실패 - 존재하지 않는 유저', async () => {
//     await expect(
//       userService.getUserToken({
//         userId: 'jest123',
//         password: '1234',
//       }),
//     ).rejects.toThrow('해당 유저를 찾지 못했습니다.');
//   });

//   test('로그인 실패 - 비밀번호 불일치', async () => {
//     await expect(
//       userService.getUserToken({
//         userId: 'jest1',
//         password: '123456789',
//       }),
//     ).rejects.toThrow('비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.');
//   });
// });

describe('회원 정보 수정 TEST', () => {
  test('회원 정보 수정 실패 - 존재하지 않는 유저', async () => {
    // const userId = '62c8691b1673e09fbcfa4298';
    const userId = '62c8691b1673e09fbcfa4297';
    const update = {
      name: 'jest1',
      track: 'SW트랙',
      trackCardinalNumber: 1,
      position: '프론트엔드',
      authImage: '이미지',
      githubAvatar: '아바타',
      githubEmail: 'test@test.com',
      githubProfileUrl: '프로필',
    };

    await expect(
      userService.setUser(userId, update),
    ).rejects.toThrow('해당 유저를 찾지 못했습니다.');
  });

  test('회원 정보 수정 성공', async () => {
    // const userId = '62c8691b1673e09fbcfa4298';
    const userId = '62c8691b1673e09fbcfa4297';
    const update = {
      name: 'jest1',
      track: 'SW트랙',
      trackCardinalNumber: 1,
      position: '프론트엔드',
      authImage: '이미지',
      githubAvatar: '아바타',
      githubEmail: 'test@test.com',
      githubProfileUrl: '프로필',
    };
    const updatedUserInfo = await userService.setUser(
      userId,
      update,
    );

    expect({
      ...(update.name && { name: updatedUserInfo?.name }),
      ...(update.track && { nickname: updatedUserInfo?.track }),
      ...(update.trackCardinalNumber && { password: updatedUserInfo?.trackCardinalNumber }),
      ...(update.position && { profile_image: updatedUserInfo?.position }),
      ...(update.authImage && { profile_image: updatedUserInfo?.authImage }),
      ...(update.githubAvatar && { profile_image: updatedUserInfo?.githubAvatar }),
      ...(update.githubEmail && { profile_image: updatedUserInfo?.githubEmail }),
      ...(update.githubProfileUrl && { profile_image: updatedUserInfo?.githubProfileUrl }),
    }).toEqual(update);
  });
});

// describe('회원 탈퇴 TEST', () => {
//   test('회원 탈퇴 실패 - 비밀번호 불일치', async () => {
//     const userId = 'jest1';
//     const password = '1234';

//     await expect(userService.deleteUser(userId, password)).rejects.toThrow(
//       '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.',
//     );
//   });

//   test('회원 탈퇴 성공', async () => {
//     const userId = 'jest1';
//     const password = '123456';
//     const result = await userService.deleteUser(userId, password);

//     expect(result).toEqual({ deletedCount: 1 });
//   });
// });
