import { Types, SortOrder, Document } from 'mongoose';
import { Project } from '../index';

interface sortFilter {
  [key: string]: SortOrder;
}
interface TagInfo {
    [key: string]: string
}

interface LikeInfo {
    [key: string]: string
}

interface CommentInfo {
  [key: string]: string
}

export interface ProjectInfo {
    title: string,
    author: string,
    authorId: string,
    shortDescription: string,
    description: string,
    thumbnail: string,
    likes?: LikeInfo[],
    tags?: TagInfo[],
    comments?: CommentInfo[],
}
export interface ProjectData extends Document<Types.ObjectId> {
    title: string,
    author: string,
    authorId: string,
    shortDescription: string,
    description: string,
    thumbnail: string,
    views: number,
    likes: LikeInfo[],
    tags: TagInfo[],
    comments: CommentInfo[],
}

export class ProjectModel {
  // 1. 새 게시글 작성
  async createProject(projectInfo: ProjectInfo): Promise<ProjectData> {
    const result = await Project.create(projectInfo);
    if (!result) {
      const error = new Error('게시글 작성에 실패하였습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 2. 전체 게시글 조회 - 최신순/인기순, 페이지네이션
  async findProjects(filter: string, page: number, perPage: number)
  : Promise<[projectList: ProjectData[], total: number ]> {
    let sortFilter: sortFilter = { createdAt: -1 };
    if (filter === 'views') {
      sortFilter = { views: -1 };
    }
    let total = await Project.countDocuments({});
    let projectList = await Project
      .find({})
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!projectList) {
      projectList = [];
    }
    return [projectList, totalPage];
  }

  // 3. 게시글 조회 - 게시글 아이디
  async findProject(projectId: string): Promise<ProjectData | null> {
    // 게시글 조회 수 1 증가 => 정보 반환
    const id = { _id: projectId };
    const update = { $inc: { views: 1 } };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(id, update, option);
    if (!updatedResult) {
      const error = new Error('프로젝트 조회에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedResult;
  }

  // 4. 게시글 수정
  async updateProject(updateInfo: any): Promise<ProjectData | null> {
    const {
      projectId, title, shortDescription, description, thumbnail, tags,
    } = updateInfo;
    const id = { _id: projectId };
    const update = {
      $set: {
        title, shortDescription, description, thumbnail, tags,
      },
    };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(id, update, option);
    if (!updatedResult) {
      const error = new Error('게시글 업데이트에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return updatedResult;
  }

  // 5. 게시글 삭제 요청 to 관리자
  async deleteProject(projectId: string): Promise<ProjectData | null> {
    // 게시글 삭제
    const result = await Project.findByIdAndDelete(projectId);
    if (!result) {
      const error = new Error('게시글 삭제에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 6. 게시글 좋아요
  async likeProject(projectId: string, update: any): Promise<ProjectData | null> {
    const option = { returnOriginal: false };
    const result = await Project.findByIdAndUpdate(projectId, update, option);
    if (!result) {
      const error = new Error('게시글 좋아요에 실패했습니다.');
      error.name = 'NotFound';
      throw error;
    }
    return result;
  }

  // 7. 게시글 검색 - 작성자
  async searchProjectsByAuthor(
    author: string,
    filter: string,
    page: number,
    perPage: number,
  ): Promise<[projectList: ProjectData[] | null, total: number]> {
    let sortFilter: sortFilter = { createdAt: -1 };
    if (filter === 'views') {
      sortFilter = { views: -1 };
    }

    let total = await Project.countDocuments({ author: new RegExp(author) });
    let projectList = await Project
      .find({ author: new RegExp(author, 'i') })
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!projectList) {
      projectList = [];
    }
    return [projectList, totalPage];
  }

  // 7. 게시글 검색 - 글 제목
  async searchProjectsByTitle(
    title: string,
    filter: string,
    page: number,
    perPage: number,
  ): Promise<[projectList: ProjectData[] | null, total: number]> {
    let sortFilter: sortFilter = { createdAt: -1 };
    if (filter === 'views') {
      sortFilter = { views: -1 };
    }
    let total = await Project.countDocuments({ title: new RegExp(title) });
    let projectList = await Project
      .find({ title: new RegExp(title, 'i') })
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!projectList) {
      projectList = [];
    }
    return [projectList, totalPage];
  }

  // 8. 마이페이지 - 게시글 조회
  async findProjectById(
    userId: string,
    page: number,
    perPage: number,
  ): Promise<[projectList: ProjectData[] | null, total: number | null]> {
    const filter = { authorId: userId };
    const sortFilter: sortFilter = { createdAt: -1 };
    let total = await Project.countDocuments(filter);
    let projectList = await Project
      .find(filter)
      .sort(sortFilter)
      .skip(perPage * (page - 1))
      .limit(perPage);
    const totalPage = Math.ceil(total / perPage);
    if (!total) {
      total = 0;
    } else if (!projectList) {
      projectList = [];
    }
    return [projectList, totalPage];
  }

  // 9. 프로젝트 댓글 추가
  async commentProject(updateInfo: any): Promise<ProjectData | null> {
    const {
      commentId, projectId,
    } = updateInfo;
    const id = { _id: projectId };
    const update: any = { $push: { comments: { commentId } } };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(id, update, option);
    return updatedResult;
  }

  // 10. 프로젝트 전체 조회 - redis
  async findAll(): Promise<ProjectData[] | null > {
    const projectList = await Project.find({});
    return projectList;
  }

  // 11. 프로젝트 좋아요, 댓글 업데이트 - redis
  async updateFromRedis(updateInfo: Partial<ProjectData>): Promise<ProjectData | null> {
    const { _id, likes, comments } = updateInfo;
    const update: any = { $set: { likes, comments } };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(_id, update, option);
    return updatedResult;
  }
}

export const projectModel = new ProjectModel();
