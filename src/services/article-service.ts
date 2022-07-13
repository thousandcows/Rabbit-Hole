import {
  articleModel, ArticleModel, ArticleData, ArticleInfo,
} from '../db/models/article-model';
import { commentModel, CommentData } from '../db/models/comment-model';
import { userService } from './user-service';
import { articleValidation } from '../utils/validation-article';

interface commentSearchCondition {
  articleId: string;
  page: number;
  perPage: number;
}

class ArticleService {
  articleModel: ArticleModel;

  constructor(articleModel: ArticleModel) {
    this.articleModel = articleModel;
  }

  // 1. 새 게시글 작성
  async createArticle(userId: string, articleInfo: ArticleInfo): Promise<ArticleData> {
    // 기본 validation
    articleValidation.createArticle(articleInfo);
    const result = await this.articleModel.createArticle(articleInfo);
    // 유저 당근 개수 조정
    // eslint-disable-next-line max-len
    if (articleInfo.carrots) {
      await userService.manageCarrots(userId, { $inc: { carrots: -articleInfo.carrots } });
    }
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

  async findArticleOne(articleId: string): Promise<ArticleData | null> {
    const article = await this.articleModel.findArticle(articleId);
    return article;
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findArticle(commentSearchCondition: commentSearchCondition)
  : Promise<[
    articleInfo: ArticleData | null,
    commentList: CommentData[] | null,
    totalPage: number]> {
    const { articleId, page, perPage } = commentSearchCondition;
    // 게시글 정보
    const articleInfo = await this.articleModel.findArticle(articleId);
    // 게시글에 있는 댓글 정보
    const [commentList, totalPage] = await commentModel.findByArticleId(articleId, page, perPage);
    return [articleInfo, commentList, totalPage];
  }

  // 4. 게시글 제목, 내용 수정
  async updateArticle(userId: string, updateInfo: any): Promise<ArticleData | null> {
    // validation
    articleValidation.updateArticle(userId, updateInfo);
    const updatedResult = await this.articleModel.updateArticle(updateInfo);
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteArticle(userId: string, articleId: string): Promise<ArticleData | null> {
    // validation - 유저 아이디, 댓글 여부
    articleValidation.deleteArticle(userId, articleId);
    // 삭제할 게시글 전용 collection으로 이동
    // 해당 게시글 삭제
    const result = await this.articleModel.deleteArticle(articleId);
    // 삭제할 댓글 전용 collection으로 이동
    // 관련 댓글 삭제
    commentModel.deleteByArticleId(articleId);
    return result;
  }

  // 6. 게시글 좋아요
  async likeArticle(articleId: string, update: any): Promise<ArticleData | null> {
    const result = await this.articleModel.likeArticle(articleId, update);
    return result;
  }

  // 7. 게시글 검색 - 글 제목
  async searchArticlesByTitle(title: string, articleType: string): Promise<ArticleData[] | null> {
    const articles = await this.articleModel.searchArticlesByTitle(title, articleType);
    return articles;
  }

  // 8. 게시글 검색 - 작성자
  async searchArticlesByAuthor(author: string, articleType: string): Promise<ArticleData[] | null> {
    const articles = await this.articleModel.searchArticlesByAuthor(author, articleType);
    return articles;
  }
}

export const articleService = new ArticleService(articleModel);
