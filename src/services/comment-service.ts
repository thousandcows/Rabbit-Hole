/* eslint-disable no-underscore-dangle */
import { Types } from 'mongoose';
import {
  commentModel, CommentModel, CommentData, CommentInfo,
} from '../db/models/comment-model';
import { validation } from '../utils/validation';

class CommentService {
  commentModel: CommentModel;

  constructor(commentModelArg: CommentModel) {
    this.commentModel = commentModelArg;
  }

  async addComment(commentInfo: CommentInfo): Promise<CommentData> {
    validation.addComment(commentInfo);

    const createdNewComments = await this.commentModel.create(commentInfo);
    return createdNewComments;
  }

  async getCommentsByArticleId(articleId: string): Promise<CommentData[] | null> {
    const comments = await this.commentModel.findByArticleId(articleId);
    return comments;
  }

  async getCommentsByAuthorId(AuthorId: string): Promise<CommentData | null> {
    const comments = await this.commentModel.findByAuthorId(AuthorId);
    return comments;
  }

  async setComment(commentId: Types.ObjectId, update: Partial<CommentInfo>): Promise<CommentData> {
    const updatedComment = await this.commentModel.update(commentId, update);
    return updatedComment;
  }

  async deleteCommentsByArticleId(articleId: Types.ObjectId): Promise<CommentData[]> {
    const deletedComments = await this.commentModel.deleteByArticleId(articleId);
    return deletedComments;
  }

  async deleteCommentsById(commentId: Types.ObjectId): Promise<CommentData> {
    const deletedComment = await this.commentModel.deleteByCommentId(commentId);
    return deletedComment;
  }
}

export const commentService = new CommentService(commentModel);
