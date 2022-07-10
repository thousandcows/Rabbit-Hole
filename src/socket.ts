import { Username } from 'aws-sdk/clients/appstream';
import * as http from 'http';
import { Server } from 'socket.io';
import { chatService } from './services/chat-service';

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const path = require('path');
const sharp = require('sharp');
const { uploadFile } = require('./s3');
interface ChatInfo {
  roomType: string,
  username: string,
  message: string,
  time: string,
  image: string,
}

// interface clientList {
//   name: string,
//   id: string,
// }

function webSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.TEST_URL,
      methods: ['GET', 'POST'],
    },
  });
  // const connectedClientList = []; // 추후 수정
  // socket 연결 중
  io.sockets.on('connect', (socket: any) => {
    // 새 접속자 입장
    socket.on('newUser', async (newUser: string) => {
      // 새 접속자 리스트에 추가
      // connectedClientList.push(newUser); // 추후 수정
      // user에게 채팅방에 입장했음을 알림
      socket.emit('updateForNewUser', `${newUser}(나)님이 입장했습니다.`);
      // 전체 접속자에게 user가 채팅방에 입장했음을 알림
      socket.broadcast.emit('updateForEveryone', `${newUser}가 도착했습니다.`);
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
      const hour = new Date().getHours().toString();
      const min = new Date().getMinutes.toString();
      const chatInfo: ChatInfo = {
        roomType: 'main',
        username: `${data.name}`,
        message: `${data.msg}`,
        time: hour + min,
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
          withoutEnlargement: true
        })
        .toBuffer();
      // 이미지 로컬에 임시 저장
      const writer = await fs.createWriteStream(path.resolve(__dirname + '/uploads/' + message.name), {
        encoding: 'base64',
      });
      await writer.write(newFile);
      await writer.end();
      // 이미지 로컬 저장 후
      await writer.on('finish', async () => {
        // 이미지 채팅창 송출
        socket.emit('image-uploaded', message);
        socket.broadcast.emit('image-uploaded', message);
        // 이미지 s3에 업로드
        const fileToUpload = {
          path: __dirname + '/uploads/' + message.name,
          filename: message.name,
          type: message.type,
        }
        const uploadResult = await uploadFile(fileToUpload);
        // 이미지 객체 url DB에 저장
        const chatInfo: ChatInfo = {
          roomType: 'main',
          username: 'username', // 추후 수정 필요함
          message: 'image', // 추후 수정 필요함
          time: new Date().getHours().toString(),
          image: uploadResult.Location,
        };
        await chatService.addChat(chatInfo);
        // 로컬에서 이미지 삭제
        await unlinkFile(fileToUpload.path);
      });
    });
  });
  // socket 연결 종료
  io.sockets.on('disconnect', () => {
    // const idx = connectedClientList.findIndex(); // 유저 정보 어떻게 가져올지 보고 결정
  });
}

export default webSocket;
