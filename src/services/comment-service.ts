/* eslint-disable no-underscore-dangle */
import {
  commentModel, CommentModel, CommentData, CommentInfo,
} from '../db/models/comment-model';
import { validation } from '../utils/validation';
import { userService } from './user-service';

class CommentService {
  commentModel: CommentModel;

  constructor(commentModelArg: CommentModel) {
    this.commentModel = commentModelArg;
  }

  // 댓글 작성
  async addComment(userId: string, commentInfo: CommentInfo): Promise<CommentData> {
    validation.addComment(commentInfo);

    const user = await userService.getUserById(userId);
    const createCommentInfo = { ...commentInfo, author: user.name, authorId: String(user._id) };

    const createdNewComments = await this.commentModel.create(createCommentInfo);
    return createdNewComments;
  }

  // 특정 게시글에 작성된 댓글 가져오기
  async getCommentsByArticleId(articleId: string): Promise<CommentData[] | null> {
    const comments = await this.commentModel.findByArticleId(articleId);
    return comments;
  }

  // 특정 유저가 작성한 댓글 가져오기
  async getCommentsByAuthorId(AuthorId: string): Promise<CommentData[] | null> {
    const comments = await this.commentModel.findByAuthorId(AuthorId);
    return comments;
  }

  // 댓글 수정
  async setComment(
    userId: string,
    commentId: string,
    update: Partial<CommentInfo>,
  ): Promise<CommentData> {
    const comment = await this.commentModel.findById(commentId);
    if (comment.authorId !== userId) {
      const error = new Error('본인이 작성한 댓글만 수정할 수 있습니다.');
      error.name = 'Forbidden';
      throw error;
    }
    const updatedComment = await this.commentModel.update(commentId, update);
    return updatedComment;
  }

  //   // 댓글 채택
  async adoptComment(
    userId: string,
    commentId: string,
    update: Partial<CommentInfo>,
  ): Promise<CommentData> {
    const article = await articleService.findArticle(commentId);
    if (article.authorId !== userId) {
      const error = new Error('본인이 작성한 게시글의 댓글만 채택할 수 있습니다.');
      error.name = 'Forbidden';
      throw error;
    }
    const updatedComment = await this.commentModel.update(commentId, update);
    return updatedComment;
  }

  // 게시글 삭제할때 댓글도 같이 삭제
  async deleteCommentsByArticleId(
    articleId: string,
  ): Promise<CommentData[]> {
    const deletedComments = await this.commentModel.deleteByArticleId(articleId);
    return deletedComments;
  }

  // 댓글 하나 삭제
  async deleteCommentsById(userId:string, commentId: string): Promise<CommentData> {
    const comment = await this.commentModel.findById(commentId);
    if (comment.authorId !== userId) {
      const error = new Error('본인이 작성한 댓글만 삭제할 수 있습니다.');
      error.name = 'Forbidden';
      throw error;
    }
    const deletedComment = await this.commentModel.deleteByCommentId(commentId);
    return deletedComment;
  }
}

export const commentService = new CommentService(commentModel);
