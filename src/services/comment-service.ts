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

  // 댓글 작성
  async addComment(commentInfo: CommentInfo): Promise<CommentData> {
    validation.addComment(commentInfo);

    const createdNewComments = await this.commentModel.create(commentInfo);
    return createdNewComments;
  }

  // 특정 게시글에 작성된 댓글 가져오기
  async getCommentsByArticleId(articleId: string): Promise<CommentData[] | null> {
    const comments = await this.commentModel.findByArticleId(articleId);
    return comments;
  }

  // 특정 유저가 작성한 댓글 가져오기
  async getCommentsByAuthorId(AuthorId: string): Promise<CommentData | null> {
    const comments = await this.commentModel.findByAuthorId(AuthorId);
    return comments;
  }

  // 댓글 수정, 채택
  async setComment(commentId: string, update: Partial<CommentInfo>): Promise<CommentData> {
    const updatedComment = await this.commentModel.update(commentId, update);
    return updatedComment;
  }

  // 게시글 삭제할때 댓글도 같이 삭제
  async deleteCommentsByArticleId(articleId: Types.ObjectId): Promise<CommentData[]> {
    const deletedComments = await this.commentModel.deleteByArticleId(articleId);
    return deletedComments;
  }

  // 댓글 하나 삭제
  async deleteCommentsById(commentId: string): Promise<CommentData> {
    const deletedComment = await this.commentModel.deleteByCommentId(commentId);
    return deletedComment;
  }
}

export const commentService = new CommentService(commentModel);
