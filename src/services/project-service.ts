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

  interface userIdSearchCondition {
    userId: string;
    page: number;
    perPage: number;
  }

  interface authorSearchCondition extends searchCondition {
    author: string;
  }

  interface titleSearchCondition extends searchCondition {
    title: string;
  }

  interface commentSearchCondition {
    projectId: string;
    page: number;
    perPage: number;
  }

  interface updateInfo {
      author:string;
      projectId: string;
      title: string;
      shortDescription: string;
      description: string;
      thumbnail: string;
      tags: TagInfo[]
  }

class ProjectService {
  projectModel: ProjectModel;

  constructor(projectModel: ProjectModel) {
    this.projectModel = projectModel;
  }

  // 1. 새 게시글 작성
  async createProject(userId: string, projectInfo: ProjectInfo): Promise<ProjectData | any> {
    // 기본 validation
    await projectValidation.createProject(projectInfo);
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

  // 3-1. 게시글 조회 - view 반환
  async findProject(projectId: string)
    : Promise<ProjectData> {
    // 게시글 정보
    const projectInfo = await this.projectModel.findProject(projectId);
    // 게시글에 있는 댓글 정보
    return projectInfo;
  }

  // 3-2. 게시글 조회 - 게시글 아이디 - 원본
  async findProjectViews(commentSearchCondition: commentSearchCondition)
    : Promise<[
      projectInfo: ProjectData | null,
      commentList: CommentData[] | null,
      totalPage: number]> {
    const { projectId, page, perPage } = commentSearchCondition;
    // 게시글 정보
    const projectInfo = await this.projectModel.findProjectViews(projectId);
    // 게시글에 있는 댓글 정보
    const [commentList, totalPage] = await commentModel.findByArticleId(projectId, page, perPage);
    return [projectInfo, commentList, totalPage];
  }

  // 4. 게시글 제목, 내용 수정
  async updateProject(userId: string, updateInfo: updateInfo): Promise<ProjectData | null> {
    // validation
    await projectValidation.updateProject(userId, updateInfo);
    const updatedResult = await this.projectModel.updateProject(updateInfo);
    return updatedResult;
  }

  // 5. 게시글 삭제
  async deleteProject(userId: string, projectId: string): Promise<ProjectData | null> {
    // validation - 유저 아이디, 댓글 여부
    await projectValidation.deleteProject(userId, projectId);
    // 삭제할 게시글 전용 collection으로 이동
    // 해당 게시글 삭제
    const result = await this.projectModel.deleteProject(projectId);
    // 삭제할 댓글 전용 collection으로 이동
    // 관련 댓글 삭제
    await commentModel.deleteByArticleId(projectId);
    // redis에서 삭제
    return result;
  }

  // 6. 게시글 좋아요
  async likeProject(userId: string, projectId: string): Promise<ProjectData | any> {
    const result = await this.projectModel.likeProject(projectId, userId);
    return result;
  }

  // 7. 게시글 검색 - 작성자
  async searchProjectsByAuthor(authorSearchCondition: authorSearchCondition)
  : Promise<[projectList: ProjectData[] | null, total: number]> {
    const {
      author, filter, page, perPage,
    } = authorSearchCondition;
    const [projectList, totalPage] = await this.projectModel
      .searchProjectsByAuthor(author, filter, page, perPage);
    return [projectList, totalPage];
  }

  // 8. 게시글 검색 - 글 제목
  async searchProjectsByTitle(titleSearchCondition: titleSearchCondition)
  : Promise<[projectList: ProjectData[] | null, total: number]> {
    const {
      title, filter, page, perPage,
    } = titleSearchCondition;
    const [projectList, totalPage] = await this.projectModel
      .searchProjectsByTitle(title, filter, page, perPage);
    return [projectList, totalPage];
  }

  // 9. 프로젝트 삭제 - 관리자
  async deleteProjectForAdmin(projectId: string): Promise<ProjectData | null> {
    // 삭제할 게시글 전용 collection으로 이동
    // 해당 게시글 삭제
    const result = await this.projectModel.deleteProject(projectId);
    // 삭제할 댓글 전용 collection으로 이동
    // 관련 댓글 삭제
    await commentModel.deleteByArticleId(projectId);
    return result;
  }

  // 10 마이페이지 - 게시글 조회
  // eslint-disable-next-line max-len
  async findProjectById(searchCondition: userIdSearchCondition): Promise<[projectList: ProjectData[] | null, total: number | null ]> {
    // eslint-disable-next-line max-len
    const {
      userId, page, perPage,
    } = searchCondition;
      // eslint-disable-next-line max-len
    const [projectList, totalPage] = await this.projectModel.findProjectById(userId, page, perPage);
    return [projectList, totalPage];
  }

  // 11. 프로젝트 댓글 추가
  async commentProject(commentId: string, projectId: string): Promise<ProjectData | null> {
    const updateInfo = { commentId, projectId };
    const result = await this.projectModel.commentProject(updateInfo);
    return result;
  }

  // 12. 프로젝트 댓글 삭제
  async pullComment(commentId: string, articleId: string): Promise<ProjectData | null> {
    const result = await this.projectModel.pullComment(commentId, articleId);
    return result;
  }
}

export const projectService = new ProjectService(projectModel);
