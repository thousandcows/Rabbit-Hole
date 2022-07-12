import { Types, Document } from 'mongoose';
import { articleModel, ArticleModel } from '../db/models/article-model';
import { articleValidation } from '../utils/validation-article';

interface TagInfo {
    [key: string]: string
}

interface LikeInfo {
    [key: string]: string
}

interface ArticleInfo {
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

class ArticleService {
  articleModel: ArticleModel;

  constructor(articleModel: ArticleModel) {
    this.articleModel = articleModel;
  }

  // 1. 새 게시글 작성
  async createArticle(articleInfo: ArticleInfo): Promise<ArticleData> {
    // validation
    articleValidation.createArticle(articleInfo);
    const result = await this.articleModel.createArticle(articleInfo);
    return result;
  }

  // 2. 전체 게시글 조회 - 최신순, 페이지네이션
  // eslint-disable-next-line max-len
  async findArticles(searchCondition: any): Promise<[articleList: ArticleData[], total: number ]> {
    // eslint-disable-next-line max-len
    const {
      articleType, filter, page, perPage,
    } = searchCondition;
    const numberedPage = Number(page);
    const numberedPerPage = Number(perPage);
    // eslint-disable-next-line max-len
    const [articleList, totalPage] = await this.articleModel.findArticles(articleType, filter, numberedPage, numberedPerPage);
    return [articleList, totalPage];
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findArticle(articleId: string): Promise<ArticleData | null> {
    const article = await this.articleModel.findArticle(articleId);
    return article;
  }

  // 4. 게시글 제목, 내용 수정
  async updateArticle(updateInfo: any): Promise<ArticleData | null> {
    // validation
    articleValidation.updateArticle(updateInfo);
    const updatedResult = await this.articleModel.updateArticle(updateInfo);
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteArticle(articleId: string): Promise<ArticleData | null> {
    // 게시글 삭제
    const result = await this.articleModel.deleteArticle(articleId);
    // 관련된 댓글 삭제: 추가
    return result;
  }

  // 6. 게시글 좋아요
  async likeArticle(articleId: string, update: any): Promise<ArticleData | null> {
    const result = await this.articleModel.likeArticle(articleId, update);
    return result;
  }
  // 7. 게시글 검색
}

export const articleService = new ArticleService(articleModel);
