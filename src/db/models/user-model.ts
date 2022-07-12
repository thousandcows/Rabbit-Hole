/* eslint-disable class-methods-use-this */
import { Types } from 'mongoose';
import { User } from '..';

export interface UserInfo {
    name: string;
    track: string;
    trackCardinalNumber: number;
    position?: string;
    authImage: string;
    blogAddress?: string;
    githubEmail: string;
    githubProfileUrl: string;
    githubAvatar: string;
    carrots?: number;
    role?: string;
  }

export interface UserData extends UserInfo {
    _id: Types.ObjectId;
  }
export class UserModel {
  async findByEmail(githubEmail: string): Promise<UserData | null> {
    const user = await User.findOne({ githubEmail });

    return user;
  }

  async findById(_id: string): Promise<UserData> {
    const user = await User.findOne({ _id });
    if (!user) {
      const error = new Error('해당 id의 사용자가 없습니다. 다시 한 번 확인해 주세요.');
      error.name = 'NotFound';
      throw error;
    }
    return user;
  }

  async findAll(): Promise<UserData[]> {
    const users = await User.find({});

    return users;
  }

  async create(userInfo: UserInfo): Promise<UserData> {
    const createdNewUser = await User.create(userInfo);

    if (!createdNewUser) {
      const error = new Error('회원가입에 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return createdNewUser;
  }

  async update(_id: string, update: Partial<UserInfo>): Promise<UserData> {
    const filter = { _id };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);

    if (!updatedUser) {
      const error = new Error('업데이트에 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return updatedUser;
  }

  async deleteByEmail(githubEmail: string): Promise<UserData> {
    const deletedUser = await User.findOneAndDelete({ githubEmail });
    if (!deletedUser) {
      const error = new Error(`${githubEmail} 사용자의 삭제에 실패하였습니다`);
      error.name = 'NotFound';
      throw error;
    }
    return deletedUser;
  }

  async deleteById(_id: string): Promise<UserData> {
    const deletedUser = await User.findOneAndDelete({ _id });
    if (!deletedUser) {
      const error = new Error('사용자의 삭제에 실패하였습니다');
      error.name = 'NotFound';
      throw error;
    }
    return deletedUser;
  }

  async manageCarrots(_id: string, update: any): Promise<UserData> {
    const filter = { _id };
    const option = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    if (!updatedUser) {
      const error = new Error('업데이트에 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedUser;
  }
}

export const userModel = new UserModel();
