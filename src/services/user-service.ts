/* eslint-disable no-underscore-dangle */
import {
  UserModel, userModel, UserInfo, UserData, ImageInfo,
} from '../db/models/user-model';
import { validation } from '../utils/validation';
import { uploadFile } from '../utils/s3';

class UserService {
  userModel: UserModel;

  constructor(userModelArg: UserModel) {
    this.userModel = userModelArg;
  }

  async addUser(userInfo: UserInfo): Promise<UserData> {
    const { githubEmail } = userInfo;

    validation.addUser(userInfo);

    const user = await this.userModel.findByEmail(githubEmail);
    if (user) {
      const error = new Error('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
      error.name = 'Conflict';
      throw error;
    }

    const createdNewUser = await this.userModel.create(userInfo);
    return createdNewUser;
  }

  async getUserByEmail(githubEmail: string): Promise<UserData | null> {
    const user = await this.userModel.findByEmail(githubEmail);
    return user;
  }

  async getUserById(_id: string): Promise<UserData> {
    const user = await this.userModel.findById(_id);
    return user;
  }

  async setUser(_id: string, update: Partial<UserInfo>): Promise<UserData> {
    const updatedUser = await this.userModel.update(_id, update);
    return updatedUser;
  }

  async deleteUser(_id: string): Promise<UserData | null> {
    const deletedUser = await this.userModel.deleteById(_id);
    return deletedUser;
  }

  async addAuthImage(imageInfo: ImageInfo): Promise<any | null> {
    const imageUrl = await uploadFile(imageInfo);
    return imageUrl;
  }

  async manageCarrots(_id: string, update: any): Promise<UserData | null> {
    const updatedUser = await this.userModel.manageCarrots(_id, update);
    return updatedUser;
  }

  // 유저 목록 조회 - 관리자
  async getAllUsers(searchCondition: any)
  : Promise<[userList: UserData[] | null, totalPage: number | null]> {
    const [userList, totalPage] = await this.userModel.findAll(searchCondition);
    return [userList, totalPage];
  }

  // 유저 승인 - 관리자
  async authorizeUser(_id: string, update: string): Promise<UserData> {
    const updatedUser = await this.userModel.authorizeUser(_id, update);
    if (!updatedUser) {
      const error = Error('해당 유저가 존재하지 않습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedUser;
  }
}

export const userService = new UserService(userModel);
