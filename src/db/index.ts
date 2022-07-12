import mongoose, { model } from 'mongoose';
import { ChatSchema } from './schemas/chat-schema';
import { UserSchema } from './schemas/user-schema';
import { ArticleSchema } from './schemas/article-schema';

const DB_URL = process.env.MONGODB_URL
  || 'MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요. \n.env 파일도 필요합니다.\n';

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('connected', () => console.log(`정상적으로 MongoDB 서버에 연결되었습니다.  ${DB_URL}`));
db.on('error', (error) => console.error(`\nMongoDB 연결에 실패하였습니다...\n${DB_URL}\n${error}`));

export const Chat = model('chats', ChatSchema);
export const User = model('users', UserSchema);
export const Article = model('articles', ArticleSchema);
