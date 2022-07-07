import { model } from 'mongoose';
import ChatSchema from '../schemas/chat-schema';

const Chat = model('chats', ChatSchema);

class ChatModel {
  // 1. 전체 메시지 조회
  async findAll() {
    const chatList = await Chat.find({});
    return chatList;
  }
  // 2. 메시지 조회 페이지네이션
  async getPaginatedChats(page: number, perPage: number) {
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

const chatModel = new ChatModel();

export default chatModel;
