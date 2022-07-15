import * as http from 'http';
import { Server } from 'socket.io';
import { chatService } from './services/chat-service';
import { uploadFile } from './utils/s3';

const sharp = require('sharp');

interface ChatInfo {
  roomType: string,
  username: string,
  message: string,
  time: string,
  image: string,
}

interface clientList {
  [key: string]: string,
}

function webSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.TEST_URL,
      methods: ['GET', 'POST'],
    },
  });
  const connectedClientList: clientList = {};
  // socket 연결 중
  io.sockets.on('connect', (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    // 새 접속자 입장
    socket.on('newUser', async (newUser: string) => { // 접속자 정보 어떻게 받을지 논의
      // 새 접속자 리스트에 추가
      connectedClientList[newUser] = newUser;
      const { clientsCount } = io.sockets.server.engine;
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;
      // user에게 채팅방에 입장했음을 알림
      socket.emit('updateForNewUser', {
        message: `${newUser}(나)님이 입장했습니다.`,
        clientList: connectedClientList,
        clientsCount,
        time: now,
      });
      // 전체 접속자에게 user가 채팅방에 입장했음을 알림
      socket.broadcast.emit('updateForEveryone', {
        message: `${newUser}가 도착했습니다.`,
        clientList: connectedClientList,
        clientsCount,
        time: now,
      });
      // 최근 20개 채팅 내역을 불러옴
      const chatList = await chatService.findAllChats();
      for (let i = 0; i < 20; i += 1) {
        const newChat = chatList[i];
        if (newChat.image === 'no image') {
          socket.emit('chat-load', newChat);
        } else {
          socket.emit('image-load', newChat);
        }
      }
    });
    // 메시지 전송 발생
    socket.on('chat message', (data: any) => {
      // user 화면에 메시지 송출
      socket.emit('chat message', `나: ${data.msg}`);
      // 다른 접속자 화면에 메시지 송출
      socket.broadcast.emit('chat message', `${data.name}: ${data.msg}`);
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;
      const chatInfo: ChatInfo = {
        roomType: 'main',
        username: `${data.name}`,
        message: `${data.msg}`,
        time: now,
        image: 'no image',
      };
      chatService.addChat(chatInfo);
    });
    // 이미지 전송 발생
    socket.on('upload-image', async (message: any) => {
      // 이미지 타입 확인
      const fileType = message.type.split('/')[0];
      if (fileType !== 'image') {
        const error = new Error('올바른 이미지 형식이 아닙니다');
        error.name = 'NotAcceptable';
        throw error;
      }
      // 이미지 크기 확인
      const fileSize = message.data.byteLength;
      if (fileSize >= 1024 * 1024) {
        const error = new Error('파일 크기는 10MB 이하여야 합니다');
        error.name = 'NotAcceptable';
        throw error;
      }
      // 이미지 사이즈 조정
      const data = await sharp(message.data).metadata();
      const newFile = await sharp(message.data)
        .resize({
          width: Math.trunc(data.width * 0.75),
          height: Math.trunc(data.height * 0.75),
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
      // 이미지 s3에 업로드
      const fileToUpload = {
        body: newFile,
        filename: message.name,
        type: message.type,
      };
      const uploadResult = await uploadFile(fileToUpload);
      if (!uploadResult) {
        const error = new Error('이미지를 s3에 업로드하는데 실패했습니다. 다시 시도해주세요');
        error.name = 'NotFound';
        throw error;
      }
      // 이미지 객체 url DB에 저장
      const chatInfo: ChatInfo = {
        roomType: 'main',
        username: 'username', // 추후 수정 필요함
        message: 'image', // 추후 수정 필요함
        time: new Date().getHours().toString(),
        image: uploadResult.Location,
      };
      const saveResult = await chatService.addChat(chatInfo);
      if (!saveResult) {
        const error = new Error('이미지를 DB에 저장하는데 실패했습니다. 다시 시도해주세요');
        error.name = 'NotFound';
        throw error;
      }
      // 이미지 채팅창 송출
      socket.emit('image-uploaded', message);
      socket.broadcast.emit('image-uploaded', message);
    });
    // socket 연결 종료
    io.sockets.on('disconnect', () => {
    // 접속자 목록에서 삭제
      delete connectedClientList.newUser;
      // 전체 접속자에게 알림
      const { clientsCount } = io.sockets.server.engine;
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;
      socket.broadcast.emit('updateForEveryone', {
        message: '가 퇴장했습니다.',
        clientList: connectedClientList,
        clientsCount,
        time: now,
      });
    });
  });
}

export default webSocket;
