import { Types, Document, SortOrder } from 'mongoose';
import { Article } from '../index';

interface type {
  articleType: string
}
interface sortFilter {
  [key: string]: SortOrder;
}
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

export interface ArticleData extends Document<Types.ObjectId> {
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
    if (!result) {
      const error = new Error('게시글 작성에 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 2. 전체 게시글 조회 - 최신순/인기순, 페이지네이션
  // eslint-disable-next-line max-len
  async findArticles(articleType: string, filter: string, page: number, perPage: number): Promise<[articleList: ArticleData[], total: number ]> {
    const type: type = { articleType };
    let sortFilter: sortFilter = { createdAt: -1 };
    if (filter === 'views') {
      sortFilter = { views: -1 };
    }

    let total = await Article.countDocuments({});
    let articleList = await Article
      .find(type)
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!articleList) {
      articleList = [];
    }
    return [articleList, totalPage];
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findArticle(articleId: string): Promise<ArticleData | null> {
    // 게시글 조회 수 1 증가 => 정보 반환
    const id = { _id: articleId };
    const update = { $inc: { views: 1 } };
    const option = { returnOriginal: false };
    const updatedResult = await Article.findByIdAndUpdate(id, update, option);
    if (!updatedResult) {
      const error = new Error('게시글 조회에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
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
    if (!updatedResult) {
      const error = new Error('게시글 업데이트에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteArticle(articleId: string): Promise<ArticleData | null> {
    // 게시글 삭제
    const result = await Article.findByIdAndDelete(articleId);
    if (!result) {
      const error = new Error('게시글 삭제에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 6. 게시글 좋아요
  async likeArticle(articleId: string, update: any): Promise<ArticleData | null> {
    const option = { returnOriginal: false };
    const result = await Article.findByIdAndUpdate(articleId, update, option);
    if (!result) {
      const error = new Error('게시글 좋아요에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 7. 게시글 검색 - 글 제목
  async searchArticlesByTitle(title: string, articleType: string): Promise<ArticleData[] | null> {
    const articles = await Article.find({ articleType, title: new RegExp(title) });
    if (!articles) {
      const error = new Error('해당 게시글이 존재하지 않습니다');
      error.name = 'NotFound';
      throw error;
    }
    return articles;
  }

  // 7. 게시글 검색 - 작성자
  async searchArticlesByAuthor(author: string, articleType: string): Promise<ArticleData[] | null> {
    const articles = await Article.find({ articleType, author: new RegExp(author) });
    if (!articles) {
      const error = new Error('해당 게시글이 존재하지 않습니다');
      error.name = 'NotFound';
      throw error;
    }
    return articles;
  }

  // 8. 게시글 제목 중복 확인
  async checkDuplicatedTitle(articleTitle: string): Promise<ArticleData[] | null> {
    const query = { title: articleTitle };
    const sameTitle = await Article.find(query);
    return sameTitle;
  }
}

export const articleModel = new ArticleModel();
