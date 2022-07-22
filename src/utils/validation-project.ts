import { ProjectInfo, projectModel } from '../db/models/project-model';

class ProjectValidation {
  async createProject(projectInfo: ProjectInfo) {
    const {
      author, authorId, title, shortDescription, description, thumbnail,
    } = projectInfo;
    if (!author) {
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
    } else if (!shortDescription) {
      const error = new Error('소개 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (shortDescription.length > 100) {
      const error = new Error('소개 내용을 100자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!description) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (description.length > 5000) {
      const error = new Error('글 내용은 5000자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!thumbnail) {
      const error = new Error('대표 사진을 등록해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }

  async updateProject(userId: string, updateInfo: any) {
    const {
      projectId, title, shortDescription, description, thumbnail,
    } = updateInfo;
    // 유저 === 작성자 확인 필요, unAuthorized
    const projectInfo = await projectModel.findProject(projectId);
    const authorId = projectInfo?.authorId;
    if (userId !== authorId) {
      const error = new Error('이 글의 작성자가 아닙니다');
      error.name = 'BadRequest';
      throw error;
    }
    if (!title) {
      const error = new Error('글 제목을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (title.length > 50) {
      const error = new Error('제목을 50자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!shortDescription) {
      const error = new Error('소개 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (shortDescription.length > 100) {
      const error = new Error('소개 내용을 100자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!description) {
      const error = new Error('글 내용을 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (description.length > 5000) {
      const error = new Error('글 내용은 5000자 이내로 입력해 주세요.');
      error.name = 'BadRequest';
      throw error;
    } else if (!thumbnail) {
      const error = new Error('대표 사진을 등록해 주세요.');
      error.name = 'BadRequest';
      throw error;
    }
  }

  async deleteProject(userId: string, projectId: string) {
    // 유저 === authorId 확인 필요함
    const projectInfo = await projectModel.findProject(projectId);
    const authorId = projectInfo?.authorId;
    if (userId !== authorId) {
      const error = new Error('이 글의 작성자가 아닙니다');
      error.name = 'Forbidden';
      throw error;
    }
  }
}
const projectValidation = new ProjectValidation();

export { projectValidation };
