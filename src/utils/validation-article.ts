import { ArticleInfo } from '../db/models/article-model';

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
    } else if (!content) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }

  updateArticle(updateInfo: any) {
    const { title, content } = updateInfo;
    if (!title) {
      const error = new Error('글 제목을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!content) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }
}
const articleValidation = new ArticleValidation();

export { articleValidation };
