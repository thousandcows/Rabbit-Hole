import { Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    track: {
      type: String,
      required: true,
    },
    trackCardinalNumber: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
      default: 'main',
    },
    chat: {
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

export { ChatSchema };
