/* eslint-disable class-methods-use-this */
import { SortOrder, Types } from 'mongoose';
import { Comment } from '..';

interface sortFilter {
  [key: string]: SortOrder;
}
interface LikeInfo {
  [key: string]: string
}

export interface CommentInfo {
    commentType: string;
    articleId: string;
    author?: string;
    authorId: string;
    content: string;
    likes?: LikeInfo[];
    isAdopted?: boolean;
  }

export interface CommentData extends CommentInfo {
    _id: Types.ObjectId;
  }
export class CommentModel {
  // 특정 게시글에 작성된 댓글 가져오기
  async findByArticleId(articleId: string, page?: number, perPage?: number)
  : Promise<[commentList: CommentData[] | null, totalPage: number]> {
    if (!page || !perPage) {
      const commentList = await Comment.find({ articleId });
      return [commentList, 0];
    }
    const sortFilter:sortFilter = { isAdopted: -1, createdAt: -1 };

    let total = await Comment.countDocuments({});
    let commentList = await Comment
      .find({ articleId })
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!commentList) {
      commentList = [];
    }

    return [commentList, totalPage];
  }

  // 특정 유저가 작성한 댓글 가져오기
  async findByAuthorId(authorId: string): Promise<CommentData[] | null> {
    const comments = await Comment.find({ authorId });
    return comments;
  }

  async findById(commentId: string): Promise<CommentData> {
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
  async deleteByArticleId(articleId: string): Promise<CommentData[]> {
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

  // 댓글 좋아요
  async likeComment(commentId: string, update: any): Promise<CommentData> {
    const option = { returnOriginal: false };
    const updatedComment = await Comment.findByIdAndUpdate(commentId, update, option);
    if (!updatedComment) {
      const error = new Error('좋아요에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedComment;
  }

  // 댓글 전체 조회
  async getAllComments(commentType: string, page: number, perPage: number): Promise<[commentList: CommentData[] | null, totalPage:number | null]> {
    const type = { commentType };
    let total = await Comment.countDocuments(type);
    let commentList = await Comment
      .find({})
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!commentList) {
      commentList = [];
    }
    return [commentList, totalPage];
  }

  // 댓글 전체 조회 - redis
  async findAll(): Promise<CommentData[] | null > {
    const commentList = await Comment.find({});
    return commentList;
  }
}

export const commentModel = new CommentModel();
