import { Types, Document } from 'mongoose';
import { Article } from '../index';

interface TagInfo {
    [key: string]: string
}

interface LikeInfo {
    [key: string]: string
}

export interface ArticleInfo {
    articleType: string,
    author: string,
    authorId: string,
    title: string,
    content: string,
    carrots?: number,
    tags?: TagInfo[],
}

interface ArticleData extends Document<Types.ObjectId> {
    articleType: string,
    author: string,
    authorId: string,
    title: string,
    content: string,
    likes: LikeInfo[],
    views: number,
    carrots: number,
    tags: TagInfo[],
}

export class ArticleModel {
  // 1. 새 게시글 작성
  async createArticle(articleInfo: ArticleInfo): Promise<ArticleData> {
    const result = await Article.create(articleInfo);
    return result;
  }

  // 2. 전체 게시글 조회 - 최신순/인기순, 페이지네이션
  // eslint-disable-next-line max-len
  async findArticles(articleType: string, filter: string, page: number, perPage: number): Promise<[articleList: ArticleData[], total: number ]> {
    const type: any = { articleType };
    let sortFilter: any = { createdAt: -1 };
    if (filter === 'views') {
      sortFilter = { views: -1 };
    }

    const total = await Article.countDocuments({});
    const articleList = await Article
      .find(type)
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    return [articleList, totalPage];
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findArticle(articleId: string): Promise<ArticleData | null> {
    // 게시글 조회 수 1 증가 => 정보 반환
    const id = { _id: articleId };
    const update = { $inc: { views: 1 } };
    const option = { returnOriginal: false };
    const updatedResult = await Article.findByIdAndUpdate(id, update, option);
    return updatedResult;
  }

  // 4. 게시글 제목, 내용 수정
  async updateArticle(updateInfo: any): Promise<ArticleData | null> {
    const {
      articleId, title, content, tags,
    } = updateInfo;
    const id = { _id: articleId };
    const update = { $set: { title, content, tags } };
    const option = { returnOriginal: false };
    const updatedResult = await Article.findByIdAndUpdate(id, update, option);
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteArticle(articleId: string): Promise<ArticleData | null> {
    // 게시글 삭제
    const result = await Article.findByIdAndDelete(articleId);
    // 관련된 댓글 삭제: 추가
    return result;
  }

  // 6. 게시글 좋아요
  async likeArticle(articleId: string, update: any): Promise<ArticleData | null> {
    const result = await Article.findByIdAndUpdate(articleId, update);
    return result;
  }
  // 7. 게시글 검색
}

export const articleModel = new ArticleModel();
