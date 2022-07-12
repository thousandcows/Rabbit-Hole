/* eslint-disable class-methods-use-this */
import { CommentInfo } from '../db/models/comment-model';
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

  addComment(commentInfo: CommentInfo): void {
    const { content } = commentInfo;
    if (!content) {
      const error = new Error('댓글 내용을 입력해 주세요.');
      error.name = 'NotFound';
      throw error;
    }
  }

  isLogin(userId: string | undefined): string {
    if (typeof userId === 'undefined') {
      const error = new Error('로그인 후 확인 가능합니다.');
      error.name = 'Unauthorized';
      throw error;
    }
    return userId;
  }
}

export const validation = new Validation();
