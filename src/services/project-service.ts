import {
  projectModel, ProjectModel, ProjectData, ProjectInfo,
} from '../db/models/project-model';
import { commentModel, CommentData } from '../db/models/comment-model';
import { projectValidation } from '../utils/validation-project';

interface TagInfo {
    [key: string]: string
}
  interface searchCondition {
    filter: string;
    page: number;
    perPage: number;
  }

  interface commentSearchCondition {
    projectId: string;
    page: number;
    perPage: number;
  }

  interface updateInfo {
      projectId: string;
      title: string;
      shortDescription: string;
      desription: string;
      thumbnail: string;
      tags: TagInfo[]
  }

class ProjectService {
  projectModel: ProjectModel;

  constructor(projectModel: ProjectModel) {
    this.projectModel = projectModel;
  }

  // 1. 새 게시글 작성
  async createProject(userId: string, projectInfo: ProjectInfo): Promise<ProjectData> {
    // 기본 validation
    projectValidation.createProject(projectInfo);
    const result = await this.projectModel.createProject(projectInfo);

    return result;
  }

  // 2. 전체 게시글 조회 - 최신순, 페이지네이션
  // eslint-disable-next-line max-len
  async findProjects(searchCondition: searchCondition): Promise<[projectList: ProjectData[], total: number ]> {
    // eslint-disable-next-line max-len
    const {
      filter, page, perPage,
    } = searchCondition;
      // eslint-disable-next-line max-len
    const [projectList, totalPage] = await this.projectModel.findProjects(filter, page, perPage);
    return [projectList, totalPage];
  }

  // 게시글 조회 - 서버에서만 사용 목적
  async findProjectOne(projectId: string): Promise<ProjectData | null> {
    const article = await this.projectModel.findProject(projectId);
    return article;
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findproject(commentSearchCondition: commentSearchCondition)
    : Promise<[
      projectInfo: ProjectData | null,
      commentList: CommentData[] | null,
      totalPage: number]> {
    const { projectId, page, perPage } = commentSearchCondition;
    // 게시글 정보
    const projectInfo = await this.projectModel.findProject(projectId);
    // 게시글에 있는 댓글 정보
    const [commentList, totalPage] = await commentModel.findByArticleId(projectId, page, perPage);
    return [projectInfo, commentList, totalPage];
  }

  // 4. 게시글 제목, 내용 수정
  async updateProject(userId: string, updateInfo: updateInfo): Promise<ProjectData | null> {
    // validation
    projectValidation.updateProject(userId, updateInfo);
    const updatedResult = await this.projectModel.updateProject(updateInfo);
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteProject(userId: string, projectId: string): Promise<ProjectData | null> {
    // validation - 유저 아이디, 댓글 여부
    projectValidation.deleteProject(userId, projectId);
    // 삭제할 게시글 전용 collection으로 이동
    // 해당 게시글 삭제
    const result = await this.projectModel.deleteProject(projectId);
    // 삭제할 댓글 전용 collection으로 이동
    // 관련 댓글 삭제
    await commentModel.deleteByArticleId(projectId);
    return result;
  }

  // 6. 게시글 좋아요
  async likeProject(userId: string, projectId: string): Promise<ProjectData | null> {
    const update = { $push: { likes: userId } };
    const result = await this.projectModel.likeProject(projectId, update);
    return result;
  }

  // 7. 게시글 검색 - 글 제목
  async searchProjectsByTitle(title: string): Promise<ProjectData[] | null> {
    const projects = await this.projectModel.searchProjectsByTitle(title);
    return projects;
  }

  // 8. 게시글 검색 - 작성자
  async searchProjectsByAuthor(author: string): Promise<ProjectData[] | null> {
    const projects = await this.projectModel.searchProjectsByAuthor(author);
    return projects;
  }
}

export const projectService = new ProjectService(projectModel);
