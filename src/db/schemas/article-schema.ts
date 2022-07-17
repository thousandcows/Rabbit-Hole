import { Schema } from 'mongoose';

const ArticleSchema = new Schema(
  {
    articleType: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      new Schema(
        {
          userId: String,
        },
        {
          _id: false,
        },
      ),
    ],
    views: {
      type: Number,
      default: 0,
    },
    carrots: {
      type: Number,
      default: 0,
    },
    tags: [
      new Schema(
        {
          name: String,
        },
        {
          _id: false,
        },
      ),
    ],
    comments: [
      new Schema(
        {
          commentId: String,
        },
        {
          _id: false,
        },
      ),
    ],
  },
  {
    collection: 'articles',
    timestamps: true,
  },
);

export { ArticleSchema };
