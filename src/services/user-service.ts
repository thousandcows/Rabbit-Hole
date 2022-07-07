import {
  UserModel, userModel, UserInfo, UserData,
} from '../db/models/user-model';

class UserService {
  userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
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

    const createdNewUser = await this.userModel.create(userInfo);
    return createdNewUser;
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
