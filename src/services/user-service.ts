/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import {
  UserModel, userModel, UserInfo, UserData,
} from '../db/models/user-model';

class UserService {
  userModel: UserModel;

  constructor(userModelArg: UserModel) {
    this.userModel = userModelArg;
  }

  async addUser(userInfo: UserInfo): Promise<UserData> {
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

    const user = await this.userModel.findByEmail(githubEmail);
    if (user) {
      const error = new Error('이 이메일은 현재 사용중입니다. 다른 이름을 입력해 주세요.');
      error.name = 'Conflict';
      throw error;
    }

    const createdNewUser = await this.userModel.create(userInfo);
    return createdNewUser;
  }

  // 로그인 및 토큰 발급
  async getUserToken(githubEmail: string) {
    if (!githubEmail) {
      throw new Error('이메일 혹은 비밀번호를 입력해 주세요.');
    }
    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(githubEmail);
    if (!user) {
      const error = new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      );
      error.name = 'NotFound';
      throw error;
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // userId와 role (일반 회원, 판매자, 관리자)을 토큰에 담아 발급한다.
    const token = jwt.sign({
      userId: user._id,
      role: user.role,
      githubEmail: user.githubEmail,
    }, secretKey, {
      expiresIn: '1h', // token 1시간 뒤  만료
    });

    if (!token) {
      throw new Error('토큰이 정상적으로 발급되지 않았습니다.');
    }

    return { token };
  }

  async getUsers(): Promise<UserData[]> {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUserByEmail(githubEmail: string): Promise<UserData> {
    const user = await this.userModel.findByEmail(githubEmail);
    return user;
  }

  async getUserById(_id: string): Promise<UserData> {
    const user = await this.userModel.findById(_id);
    return user;
  }

  async setUser(githubEmail: string, update: Partial<UserInfo>): Promise<UserData> {
    const updatedUser = await this.userModel.update(githubEmail, update);
    return updatedUser;
  }

  async deleteUser(githubEmail: string): Promise<UserData> {
    const deletedUser = await this.userModel.deleteByEmail(githubEmail);
    return deletedUser;
  }
}

export const userService = new UserService(userModel);
