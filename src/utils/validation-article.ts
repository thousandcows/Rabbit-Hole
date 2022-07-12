import { ArticleInfo, articleModel } from '../db/models/article-model';
import { commentModel } from '../db/models/comment-model';

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
    // 질문 게시판: 채택된 답변이 있으면 수정이 불가능함
    if (articleInfo?.articleType === 'question') {
      const commentList = await commentModel.findByArticleId(articleId);
      if (commentList) {
        for (let i = 0; i < commentList?.length; i += 1) {
          if (commentList[i].isAdopted === true) {
            const error = new Error('채택된 질문은 수정할 수 없습니다.');
            error.name = 'BadRequest';
            throw error;
          }
        }
      }
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
    // 질문 게시판: 댓글이 있으면 삭제가 불가능함
    if (articleInfo?.articleType === 'question') {
      const commentList = await commentModel.findByArticleId(articleId);
      if (commentList) {
        const error = new Error('댓글이 존재하여 삭제할 수 없습니다.');
        error.name = 'BadRequest';
        throw error;
      }
    }
  }

  async checkDuplicatedTitle(articleTitle: string) {
    const isTitleNotOk = await articleModel.checkDuplicatedTitle(articleTitle);
    if (isTitleNotOk) {
      const error = new Error('이미 존재하는 제목입니다.');
      error.name = 'BadRequest';
      throw error;
    }
  }
}
const articleValidation = new ArticleValidation();

export { articleValidation };
