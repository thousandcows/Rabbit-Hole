import { Types, Document } from 'mongoose';
import { chatModel, ChatModel } from '../db/models/chat-model';

interface ChatInfo {
    roomType: string;
    username: string;
    message: string;
    time?: string;
    image: string;
  }
interface ChatData extends Document<Types.ObjectId> {
    roomType: string;
    username: string;
    message: string;
    time?: string;
    image: string;
  }

class ChatService {
  chatModel: ChatModel;

  constructor(chatModel: ChatModel) {
    this.chatModel = chatModel;
  }

  // 1. 새 메시지 추가
  async addChat(chat: ChatInfo): Promise<ChatData> {
    const result = await chatModel.addChat(chat);
    return result;
  }

  // 2. 전체 메시지 조회
  async findAllChats(): Promise<ChatData[]> {
    const chatList = await this.chatModel.findAllChats();
    if (!chatList) {
      return [];
    }
    return chatList;
  }

  // 3. 메시지 조회 페이지네이션
  // eslint-disable-next-line max-len
  async getPaginatedChats(page: number, perPage: number): Promise<[charList: ChatData[], totalPage: number]> {
    const [chatList, totalPage] = await this.chatModel.getPaginatedChats(page, perPage);
    return [chatList, totalPage];
  }
}

export const chatService = new ChatService(chatModel);
