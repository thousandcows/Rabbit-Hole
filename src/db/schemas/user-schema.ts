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
      default: '공통',
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
      default: 100,
    },
    role: {
      type: String,
      default: 'guest',
    },
    articles: [
      new Schema(
        {
          articleId: {
            type: String,
            required: true,
          },
        },
        {
          _id: false,
        },
      ),
    ],

  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };
