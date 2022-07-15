/* eslint-disable no-underscore-dangle */
import {
  commentModel, CommentModel, CommentData, CommentInfo,
} from '../db/models/comment-model';
import { validation } from '../utils/validation';
import { userService } from './user-service';
import { articleService } from './article-service';

interface searchCondition {
  articleId: string;
  page: number;
  perPage: number;
}
class CommentService {
  commentModel: CommentModel;

  constructor(commentModel: CommentModel) {
    this.commentModel = commentModel;
  }

  // 댓글 작성
  async addComment(
    userId: string,
    articleId: string,
    commentInfo: CommentInfo,
  ): Promise<CommentData> {
    validation.addComment(commentInfo);

    const user = await userService.getUserById(userId);
    const createCommentInfo = {
      ...commentInfo, author: user.name, authorId: userId, articleId,
    };

    const createdNewComments = await this.commentModel.create(createCommentInfo);
    return createdNewComments;
  }

  // 특정 게시글에 작성된 댓글 가져오기
  async getCommentsByArticleId(searchCondition: searchCondition)
  : Promise<[commentList: CommentData[] | null, totalPage: number]> {
    const { articleId, page, perPage } = searchCondition;
    const [
      commentList, totalPage,
    ] = await this.commentModel.findByArticleId(articleId, page, perPage);
    return [commentList, totalPage];
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

  // 댓글 채택
  async adoptComment(
    userId: string,
    commentId: string,
    update: Partial<CommentInfo>,
  ): Promise<CommentData> {
    // 이 댓글
    const comment = await this.commentModel.findById(commentId);
    const article = await articleService.findArticleOne(comment.articleId);

    // 댓글 채택
    if (article && String(article.authorId) !== userId) {
      const error = new Error('본인이 작성한 게시글의 댓글만 채택할 수 있습니다.');
      error.name = 'Forbidden';
      throw error;
    }

    // 채택 중복 방지
    const [commentList] = await this.commentModel.findByArticleId(comment.articleId);
    if (!commentList) {
      const error = Error('댓글을 불러올 수 없습니다.');
      error.name = 'NotFound';
      throw error;
    }

    for (let i = 0; i < commentList.length; i += 1) {
      if (commentList[i].isAdopted === true) {
        const error = Error('한개의 답변에만 채택할 수 있습니다.');
        error.name = 'Conflict';
        throw error;
      }
    }

    const updatedComment = await this.commentModel.update(commentId, update);

    // 당근을 답변자에게 전달

    const commenterId = updatedComment.authorId;
    if (commenterId) {
      const carrotUpdate = { $inc: { carrots: article?.carrots } };
      await userService.manageCarrots(commenterId, carrotUpdate);
    }
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

  // 댓글 좋아요
  async likeComment(userId:string, commentId: string): Promise<CommentData> {
    const update = { $push: { likes: userId } };
    const updatedComment = await this.commentModel.likeComment(commentId, update);
    return updatedComment;
  }

  // 전체 댓글 조회
  // eslint-disable-next-line max-len
  async getAllComments(searchCondition: any): Promise<[commentList: CommentData[] | null, totalPage:number | null]> {
    // eslint-disable-next-line max-len
    const { commentType, page, perPage } = searchCondition;
    const [commentList, totalPage] = await this.commentModel.getAllComments(commentType, page, perPage);
    return [commentList, totalPage];
  }

  // 댓글 삭제 - 관리자
  async deleteCommentForAdmin(commentId: string): Promise<CommentData> {
    const deletedComment = await this.commentModel.deleteByCommentId(commentId);
    return deletedComment;
  }
}

export const commentService = new CommentService(commentModel);
