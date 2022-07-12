import { ArticleInfo, articleModel } from '../db/models/article-model';

class ArticleValidation {
  createArticle(articleInfo: ArticleInfo) {
    const {
      articleType, author, authorId, title, content,
    } = articleInfo;
    if (!articleType) {
      const error = new Error('게시글 타입을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!author) {
      const error = new Error('작성자 이름을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!authorId) {
      const error = new Error('작성자 아이디를 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!title) {
      const error = new Error('글 제목을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (title.length > 100) {
      const error = new Error('제목을 100자 이내로 입력해주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!content) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (content.length > 5000) {
      const error = new Error('글 내용은 5000자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }

  async updateArticle(userId: string, updateInfo: any) {
    const { articleId, title, content } = updateInfo;
    // 유저 === 작성자 확인 필요, unAuthorized
    const articleInfo = await articleModel.findArticle(articleId);
    const authorId = articleInfo?.authorId;
    if (userId !== authorId) {
      const error = new Error('이 글의 작성자가 아닙니다');
      error.name = 'BadRequest';
      throw error;
    }

    if (!title) {
      const error = new Error('글 제목을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (title.length < 1) {
      const error = new Error('제목은 최소 1자 이상 입력해주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (title.length > 100) {
      const error = new Error('제목을 100자 이내로 입력해주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!content) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (content.length < 1) {
      const error = new Error('글 내용은 최소 1자 이상 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (content.length > 5000) {
      const error = new Error('글 내용은 5000자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }

  async deleteArticle(userId: string, articleId: string) {
    // 유저 === authorId 확인 필요함
    const articleInfo = await articleModel.findArticle(articleId);
    const authorId = articleInfo?.authorId;
    if (userId !== authorId) {
      const error = new Error('이 글의 작성자가 아닙니다');
      error.name = 'BadRequest';
      throw error;
    }
  }
}
const articleValidation = new ArticleValidation();

export { articleValidation };
