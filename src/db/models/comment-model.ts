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

  async findByAuthorId(AuthorId: string): Promise<CommentData | null> {
    const user = await Comment.findOne({ AuthorId });
    return user;
  }

  async create(commentInfo: CommentInfo): Promise<CommentData> {
    const createdNewComment = await Comment.create(commentInfo);

    if (!createdNewComment) {
      const error = new Error('댓글 작성을 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return createdNewComment;
  }

  async update(articleId: string, update: Partial<CommentInfo>): Promise<CommentData> {
    const filter = { articleId };
    const option = { returnOriginal: false };

    const updatedComment = await Comment.findOneAndUpdate(filter, update, option);

    if (!updatedComment) {
      const error = new Error('댓글 수정을 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }

    return updatedComment;
  }

  async deleteByArticleId(articleId: string): Promise<CommentData[]> {
    const deletedComments = await Comment.find({ articleId });
    await Comment.deleteMany({ articleId });
    if (!deletedComments) {
      const error = new Error('게시글에 작성된 댓글을 삭제하지 못했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return deletedComments;
  }

  async deleteByCommentId(_id: string): Promise<CommentData> {
    const deletedComment = await Comment.findOneAndDelete({ _id });
    if (!deletedComment) {
      const error = new Error('댓글을 삭제하지 못했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return deletedComment;
  }
}

export const commentModel = new CommentModel();
