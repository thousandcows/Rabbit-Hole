/* eslint-disable no-restricted-syntax */
import * as http from 'http';
import { Server } from 'socket.io';
import { chatService } from './services/chat-service';
interface ChatInfo {
  senderId: string,
  profile: string,
  name: string,
  track: string,
  trackCardinalNumber: number,
  chat: string,
  time: string,
  image: string,
  roomType: string,
}
interface ChatData {
  roomType: string,
  username: string,
  message: string,
  time: string,
  image: string,
}
interface User {
  name: string,
  track: string,
  trackCardinalNumber: number,
  avatar: string
}

interface clientList {
  [key: string]: User
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

  // namespace 구분, 각자 고유의 room, event 등을 가진다.
  const siteSocket = io.of('/site');
  const chatSocket = io.of('/chat');

  // io.sockets.on => chatSocket.on으로 변경
  chatSocket.on('connect', (socket: any) => {
    // 모든 이벤트 감시
    socket.onAny((event: any) => {
      console.log(event);
    });

    socket.on('newUser', async (clientId: string, newUser: User) => {
      // 새 접속자 리스트에 추가
      connectedClientList[clientId] = newUser;
    });

    // 룸 리스트 업데이트
    socket.on('fetchRoom', () => {
      const rooms = chatSocket.adapter.rooms.keys();
      const arr = [];
      for (const item of rooms) {
        // roomName은 항상 (Room-이름) 형식으로 작성(default room과 구분)
        // 프론트에서는 split('-')[1]로 구분해서 표시함
        if (item.split('-')[0] === 'Room') {
          const participants: User[] = [];
          const participantList = chatSocket.adapter.rooms.get(item);
          participantList?.forEach((clientId) => {
            if (connectedClientList[clientId]) {
              participants.push(connectedClientList[clientId]);
            }
          });
          arr.push({ roomName: item, participants });
        }
      }
      chatSocket.emit('showRoomList', arr);
    });

    // 룸 접속
    socket.on('joinRoom', (clientId: string, roomName: string) => {
      socket.join(roomName);
      const participants: User[] = [];
      const room = chatSocket.adapter.rooms.get(roomName);
      room?.forEach((clientId) => {
        if (connectedClientList[clientId]) {
          participants.push(connectedClientList[clientId]);
        }
      });

      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;

      // user에게 채팅방에 입장했음을 알림
      chatSocket.to(clientId).emit('updateForNewUser', {
        message: `${connectedClientList[clientId].name}(나)님이 입장했습니다.`,
        clientList: participants,
        time: now,
      });

      // room 내 전체 접속자에게 user가 채팅방에 입장했음을 알림
      chatSocket.to(roomName).emit('updateForEveryone', {
        message: `${connectedClientList[clientId].name}님이 입장했습니다.`,
        clientList: participants,
        time: now,
      });
    });

    // 채팅방 퇴장
    socket.on('leaveRoom', (clientId: string, roomName: string) => {
      socket.leave(roomName);
      const participants: User[] = [];
      const participantList = chatSocket.adapter.rooms.get(roomName);
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;
      participantList?.forEach((participant) => {
        if (connectedClientList[participant]) {
          participants.push(connectedClientList[participant]);
        }
      });
      chatSocket.to(roomName).emit('updateLeaveEveryone', {
        message: `${connectedClientList[clientId].name}님이 퇴장했습니다.`,
        clientList: participants,
        time: now,
      });
    });

    // 메시지 전송 발생
    socket.on('chatMessage', (roomName: string, data: any) => {
      // 채팅방 전체에 전송
      chatSocket.to(roomName).emit('responseMessage', data);
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;
      const chatInfo: ChatData = {
        roomType: roomName,
        username: data.name,
        message: data.chat,
        time: now,
        image: 'no image',
      };
      chatService.addChat(chatInfo);
    });
  });
}

export default webSocket;
