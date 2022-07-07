import { Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
    roomType: {
      type: String,
      required: true,
      default: 'main',
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      required: false,
      default: 'no image',
    },
  },
  {
    collection: 'chats',
    timestamps: true,
  },
);

export default ChatSchema;
