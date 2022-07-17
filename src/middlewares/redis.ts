import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { articleModel, ArticleData } from '../db/models/article-model';
import { commentModel } from '../db/models/comment-model';
import { projectModel, ProjectData } from '../db/models/project-model';
import { articleService, projectService, commentService } from '../services';

const client = createClient({
  url: process.env.REDIS_URL,
});

// server 켜졌을 때 전체 데이터 업로드: 딱 한 번
async function getAllData(): Promise<any> {
  // 전체 게시글 개수 가져오기
  const articleList = await articleModel.findAll();
  // 전체 프로젝트 개수 가져오기
  const projectList = await projectModel.findAll();
  // 전체 댓글 개수 가져오기
  const commentList = await commentModel.findAll();
  return [articleList, projectList, commentList];
}

async function fillDatabase():Promise<void> {
  const [articleList, projectList, commentList] = await getAllData();
  // 전체 게시글 개수 가져오기
  // const articleList = await articleModel.findAll();
  if (articleList) {
    for (const article of articleList) {
      const { articleType, _id } = article;
      const key = `${articleType}:${String(_id)}`;
      await client.json.set(key, '$', article);
    }
  }

  // 전체 프로젝트 개수 가져오기
  // const projectList = await projectModel.findAll();
  if (projectList) {
    for (const project of projectList) {
      const { _id } = project;
      const key = `project:${String(_id)}`;
      await client.json.set(key, '$', project);
    }
  }
  // 전체 댓글 개수 가져오기
  // const commentList = await commentModel.findAll();
  if (commentList) {
    for (const comment of commentList) {
      const { _id } = comment;
      const key = `comment:${String(_id)}`;
      await client.json.set(key, '$', comment);
    }
  }
}

// 게시글 생성 => redis에 반영
async function uploadNewArticle(article: any) {
  const { articleType, _id } = article;
  const key = `${articleType}:${String(_id)}`;
  await client.json.set(key, '$', article);
}

// 게시글 삭제 => redis에 반영
async function deleteArticleFromRedis(articleType: string, articleId: string) {
  const key = `${articleType}:${articleId}`;
  const result = await client.json.del(key);
  return result;
}

// 프로젝트 생성 => redis에 반영
async function uploadNewProject(project: any) {
  const { _id } = project;
  const key = `project:${String(_id)}`;
  await client.json.set(key, '$', project);
}

// 프로젝트 삭제 => redis에 반영
async function deleteProjectFromRedis(proejctId: string) {
  const key = `project:${proejctId}`;
  const result = await client.json.del(key);
  return result;
}

// 댓글 생성 => redis에 반영
async function uploadNewComment(comment: any) {
  const { _id } = comment;
  const key = `comment:${String(_id)}`;
  await client.json.set(key, '$', comment);
}

// 댓글 삭제 => redis에 반영
async function deleteCommentFromRedis(commentId: string) {
  const key = `comment:${commentId}`;
  const result = await client.json.del(key);
  return result;
}

// 실시간 좋아요 기능  => 게시글, 댓글, 프로젝트
async function putLikes(type: string, articleId: string, userId: string) {
  // 1. 받은 데이터를 put한다.
  const key = `${type}:${articleId}`;
  const field = '.likes';
  const update = { userId }
  // 해당 게시글에 userId가 있는지 확인한다
  const index = await client.json.arrIndex(key, field, { userId });
  let result: any;
  if (index >= 0) {
    // userId가 있으면 삭제한다
    if (typeof index === 'number') {
      result = await client.json.arrPop(key, field, index);
    } else {
      result = await client.json.arrPop(key, field, index[0]);
    }
  } else {
    // userId가 없으면 추가한다
    result = await client.json.arrAppend(key, field, update);
  }
  // 2. 성공 여부를 client에 보내준다.
  return result;
}

// 실시간 댓글 업데이트 기능 => 게시글, 댓글, 프로젝트
async function putComments(commentType: string, articleId: string, commentId: string) {
  // 1. 받은 데이터를 put한다.
  const key = `${commentType}:${articleId}`;
  const field = '.comments';
  const update = { commentId };
  const result = await client.json.arrAppend(key, field, update);
  // 2. 성공 여부를 client에 보내준다.
  return result;
}

// 실시간 댓글 삭제 기능 => 게시글, 댓글, 프로젝트
async function pullComments(commentType: string, articleId: string, commentId: string) {
  // 1. 받은 데이터를 pull한다.
  const key = `${commentType}:${articleId}`;
  const field = '.comments';
  // eslint-disable-next-line max-len
  const index = await client.json.arrIndex(key, field, { commentId });
  let result: any;
  if (typeof index === 'number') {
    result = await client.json.arrPop(key, field, index);
  } else {
    result = await client.json.arrPop(key, field, index[0]);
  }
  // 2. 성공 여부를 client에 보내준다.
  // return result;
  return result;
}

// client-side caching 기능: 좋아요, 댓글 수
function cache(req: Request, res: Response, next: NextFunction) {
  // 1. clinet의 요청을 cache가 중간에서 받는다
  // 2. req를 분석한다 => type, sortFilter, page, perPage
  // 2. 데이터 목록을 pagination 한다
  // 3. 요청한 데이터를 client에 보낸다
}

// bulk insert 기능
async function updateDatabase(): Promise<any> {
  // 1. node-scheduler가 job을 설정해서 호출한다
  // 2. 메모리에 있는 모든 데이터를 get한다
  for await (const key of client.scanIterator()) {
    console.log('key', key);
    // const value = await client.json.get(key);
    // if (value) {
    //   console.log(value);
    // }
  }
  // 3. 모두 DB에 업데이트한다
}

export {
  client, 
  fillDatabase, 
  putLikes, 
  putComments, 
  updateDatabase, 
  cache, 
  uploadNewArticle, 
  uploadNewProject,
  deleteArticleFromRedis, 
  deleteProjectFromRedis,
  pullComments,
  uploadNewComment,
  deleteCommentFromRedis,
};
