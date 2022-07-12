/* eslint-disable class-methods-use-this */
import { Types } from 'mongoose';
import { Comment } from '..';

export interface CommentInfo {
    commentType: string;
    articleId: string;
    author: string;
    authorId: string;
    content: string;
    likes?: number;
    isAdopted?: boolean;
  }

export interface CommentData extends CommentInfo {
    _id: Types.ObjectId;
  }
export class CommentModel {
  // 특정 게시글에 작성된 댓글 가져오기
  async findByArticleId(articleId: string): Promise<CommentData[] | null> {
    const comments = await Comment.find({ articleId });

    return comments;
  }

  // 특정 유저가 작성한 댓글 가져오기
  async findByAuthorId(authorId: string | Types.ObjectId): Promise<CommentData[] | null> {
    const comments = await Comment.find({ authorId });
    return comments;
  }

  async findById(commentId: Types.ObjectId): Promise<CommentData> {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      const error = new Error('댓글이 존재하지 않습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return comment;
  }

  // 댓글 작성
  async create(commentInfo: CommentInfo): Promise<CommentData> {
    const createdNewComment = await Comment.create(commentInfo);

    if (!createdNewComment) {
      const error = new Error('댓글 작성을 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return createdNewComment;
  }

  // 댓글 수정, 채택
  async update(commentId: string, update: Partial<CommentInfo>): Promise<CommentData> {
    const filter = { _id: commentId };
    const option = { returnOriginal: false };

    const updatedComment = await Comment.findOneAndUpdate(filter, update, option);

    if (!updatedComment) {
      const error = new Error('댓글 수정을 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return updatedComment;
  }

  // 게시글 삭제할때 댓글도 같이 삭제
  async deleteByArticleId(articleId: Types.ObjectId): Promise<CommentData[]> {
    const deletedComments = await Comment.find({ _id: articleId });
    await Comment.deleteMany({ _id: articleId });
    if (!deletedComments) {
      const error = new Error('게시글에 작성된 댓글을 삭제하지 못했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return deletedComments;
  }

  // 댓글 하나 삭제
  async deleteByCommentId(commentId: string): Promise<CommentData> {
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
    if (!deletedComment) {
      const error = new Error('댓글을 삭제하지 못했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return deletedComment;
  }
}

export const commentModel = new CommentModel();
