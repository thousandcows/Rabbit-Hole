import { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    commentType: {
      type: String,
      required: true,
    },
    articleId: {
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
    isAdopted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'comments',
    timestamps: true,
  },
);

export { CommentSchema };
