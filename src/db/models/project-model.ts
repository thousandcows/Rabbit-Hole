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
    return updatedResult;
  }

  // 4. 게시글 수정
  async updateProject(updateInfo: any): Promise<ProjectData | null> {
    const {
      author, projectId, title, shortDescription, description, thumbnail, tags,
    } = updateInfo;
    const id = { _id: projectId };
    const update = {
      $set: {
        author, title, shortDescription, description, thumbnail, tags,
      },
    };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(id, update, option);
    return updatedResult;
  }

  // 5. 게시글 삭제 요청 to 관리자
  async deleteProject(projectId: string): Promise<ProjectData | null> {
    // 게시글 삭제
    const result = await Project.findByIdAndDelete(projectId);
    return result;
  }

  // 6. 게시글 좋아요
  async likeProject(projectId: string, userId: string): Promise<ProjectData | null> {
    let update: any = { $push: { likes: { userId } } };
    const checkProject = await Project.findById(projectId);
    const likeArray: any = checkProject?.likes;
    for (let i = 0; i < likeArray.length; i += 1){
      if (likeArray[i].userId === userId) {
        update = { $pull: { likes: { userId } } };
      }
    }
    const option = { returnOriginal: false };
    const result = await Project.findByIdAndUpdate(projectId, update, option);
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

  // 11. 프로젝트 댓글 삭제
  async pullComment(commentId: string, articleId: string): Promise<ProjectData | null> {
    const id = { _id: articleId };
    const update: any = { $pull: { comments: { commentId } } };
    const option = { returnOriginal: false };
    const updatedResult = await Project.findByIdAndUpdate(id, update, option);
    return updatedResult;
  }
}

export const projectModel = new ProjectModel();
