import { Schema } from 'mongoose';

const MentoringSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mentor: {
      type: String,
      required: true,
    },
    mentorId: {
      type: String,
      required: true,
    },
    mentees: [
      new Schema(
        {
          userId: String,
          userName: String,
          phone: String,
          email: String,
          content: String,
          date: String,
        },
        {
          _id: false,
        },
      ),
    ],
    pendingMentees: [
      new Schema(
        {
          userId: String,
          userName: String,
          phone: String,
          email: String,
          content: String,
          date: String,
        },
        {
          _id: false,
        },
      ),
    ],
    content: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: '모집 중',
    },
  },
  {
    collection: 'mentorings',
    timestamps: true,
  },
);

export { MentoringSchema };
