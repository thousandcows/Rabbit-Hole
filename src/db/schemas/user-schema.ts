import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
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
    position: {
      type: String,
      required: false,
      default: '',
    },
    authImage: {
      type: String,
      required: true,
    },
    blogAddress: {
      type: String,
      required: false,
      default: '',
    },
    githubEmail: {
      type: String,
      required: true,
    },
    githubProfileUrl: {
      type: String,
      required: true,
    },
    githubAvatar: {
      type: String,
      required: true,
    },
    carrots: {
      type: Number,
      required: false,
      default: 100,
    },
    role: {
      type: String,
      required: false,
      default: 'guest',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };
