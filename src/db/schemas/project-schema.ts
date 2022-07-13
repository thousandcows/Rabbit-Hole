import { Schema } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: {
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
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
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
  },
  {
    collection: 'projects',
    timestamps: true,
  },
);

export { ProjectSchema };
