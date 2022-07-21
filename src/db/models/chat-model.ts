/* eslint-disable max-len */
import { Types, Document } from 'mongoose';
import { Chat } from '../index';

interface ChatInfo {
  senderId: string,
  profile: string,
  name: string,
  track: string,
  trackCardinalNumber: number,
  chat: string,
  time: string,
  image: string,
  roomType: string,
}

interface ChatData extends Document<Types.ObjectId> {
  senderId: string,
  profile: string,
  name: string,
  track: string,
  trackCardinalNumber: number,
  chat: string,
  time?: string,
  image: string,
  roomType: string,
}
export class ChatModel {
  // 1. 새 메시지 추가
  async addChat(chat: ChatInfo): Promise<ChatData> {
    const result = await Chat.create(chat);
    return result;
  }

  // 2. 전체 메시지 조회
  async findAllChats(): Promise<ChatData[]> {
    const chatList = await Chat.find({}).sort({ createdAt: -1 });
    return chatList;
  }

  // 3. 메시지 조회 페이지네이션
  async getPaginatedChats(page: number, perPage: number): Promise<[charList: ChatData[], totalPage: number]> {
    const [total, chatList] = await Promise.all([
      Chat.countDocuments({}),
      Chat
        .find({})
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage),
    ]);
    const totalPage = Math.ceil(total / perPage);
    return [chatList, totalPage];
  }
}

export const chatModel = new ChatModel();
