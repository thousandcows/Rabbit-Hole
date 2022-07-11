/* eslint-disable class-methods-use-this */
import { UserInfo } from '../db/models/user-model';

class Validation {
  addUser(userInfo: UserInfo): void {
    const {
      name, track, trackCardinalNumber, authImage, githubEmail, githubProfileUrl, githubAvatar,
    } = userInfo;

    if (!name
             || !track
             || !trackCardinalNumber
             || !authImage
             || !githubEmail
             || !githubProfileUrl
             || !githubAvatar) {
      const error = new Error('필수 정보를 전부 입력해 주세요.');
      error.name = 'NotFound';
      throw error;
    }
  }
}

export const validation = new Validation();
