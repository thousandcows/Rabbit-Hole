// /* eslint-disable no-unused-vars */
// /* eslint-disable max-len */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable no-undef */

// import * as db from './utils/db';
// import { userService } from '../services';

// beforeAll(() => db.connect());
// afterAll(() => db.close());

// describe('회원가입 TEST', () => {
//   test('회원가입 성공', async () => {
//     const user = await userService.addUser({
//       name: 'jest1',
//       track: 'SW트랙',
//       trackCardinalNumber: 1,
//       position: '프론트엔드',
//       authImage: '이미지',
//       githubAvatar: '아바타',
//       githubEmail: 'test@test.com',
//       githubProfileUrl: '프로필',
//     });

//     expect(user).toEqual(user);
//   });

//   test('회원가입 실패 - 중복 이메일', async () => {
//     const updatedUser = await userService.addUser({
//       name: 'jest1',
//       track: 'SW트랙',
//       trackCardinalNumber: 1,
//       position: '프론트엔드',
//       authImage: '이미지',
//       githubAvatar: '아바타',
//       githubEmail: 'chss3339@gmail.com',
//       githubProfileUrl: '프로필',
//     });
//     await expect(
//       userService.addUser({
//         name: 'jest1',
//         track: 'SW트랙',
//         trackCardinalNumber: 1,
//         position: '프론트엔드',
//         authImage: '이미지',
//         githubAvatar: '아바타',
//         githubEmail: 'chss3339@gmail.com',
//         githubProfileUrl: '프로필',
//       }),
//     ).rejects.toThrow('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
//   });
// });

// describe('회원 정보 수정 TEST', () => {
//   test('회원 정보 수정 실패 - 존재하지 않는 유저', async () => {
//     // const userId = '62c8691b1673e09fbcfa4298';
//     const userId = '62c8691b1673e09fbcfa4297';
//     const update = {
//       name: 'jest1',
//       track: 'SW트랙',
//       trackCardinalNumber: 1,
//       position: '프론트엔드',
//       authImage: '이미지',
//       githubAvatar: '아바타',
//       githubEmail: 'test@test.com',
//       githubProfileUrl: '프로필',
//     };

//     await expect(
//       userService.setUser(userId, update),
//     ).rejects.toThrow('업데이트에 실패하였습니다.');
//   });

//   test('회원 정보 수정 성공', async () => {
//     const createdUser = await userService.addUser({
//       name: 'jest1',
//       track: 'SW트랙',
//       trackCardinalNumber: 1,
//       position: '프론트엔드',
//       authImage: '이미지',
//       githubAvatar: '아바타',
//       githubEmail: 'test1@test.com',
//       githubProfileUrl: '프로필',
//     });
//     const userId = String(createdUser._id);
//     const update = {
//       name: 'jest1',
//       track: 'AI트랙',
//       trackCardinalNumber: 2,
//       position: '프론트엔드',
//       authImage: '이미지',
//       githubAvatar: '아바타',
//       githubEmail: 'test1@test.com',
//       githubProfileUrl: '프로필',
//     };
//     const updatedUserInfo = await userService.setUser(
//       userId,
//       update,
//     );

//     expect({
//       ...(update.name && { name: updatedUserInfo?.name }),
//       ...(update.track && { track: updatedUserInfo?.track }),
//       ...(update.trackCardinalNumber && { trackCardinalNumber: updatedUserInfo?.trackCardinalNumber }),
//       ...(update.position && { position: updatedUserInfo?.position }),
//       ...(update.authImage && { authImage: updatedUserInfo?.authImage }),
//       ...(update.githubAvatar && { githubAvatar: updatedUserInfo?.githubAvatar }),
//       ...(update.githubEmail && { githubEmail: updatedUserInfo?.githubEmail }),
//       ...(update.githubProfileUrl && { githubProfileUrl: updatedUserInfo?.githubProfileUrl }),
//     }).toEqual(update);
//   });
// });
