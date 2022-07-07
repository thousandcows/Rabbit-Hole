import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

interface UserInfo {
    name: string;
    track: string;
    trackCardinalNumber: number;
    position: string;
    authImage: string;
    blogAddress: string;
    githubEmail: string;
    githubProfileUrl: string;
    githubAvatar: string;
    carrots: number;
    role: string;
  }

const User = model('users', UserSchema);

export class UserModel {
  static async findByEmail(githubEmail: string) {
    const user = await User.findOne({ githubEmail });
    return user;
  }

  static async findById(_id: string) {
    const user = await User.findOne({ _id });
    return user;
  }

  static async findAll() {
    const users = await User.find({});
    return users;
  }

  static async create(userInfo: UserInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  static async update(githubEmail: string, update: Partial<UserInfo>) {
    const filter = { githubEmail };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  static async deleteByEmail(githubEmail: string) {
    const deletedUser = await User.findOneAndDelete({ githubEmail });
    return deletedUser;
  }
}

export const userModel = new UserModel();
