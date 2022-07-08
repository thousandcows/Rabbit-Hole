import * as http from 'http';
import { Server } from 'socket.io';
import { chatService } from './services/chat-service';

function webSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4000',
      methods: ['GET', 'POST'],
    },
  });

  // socket 연결 중
  io.sockets.on('connect', (socket: any) => {
    // 새 접속자 입장
    socket.on('newUser', (newUser: string) => {
      // user에게 채팅방에 입장했음을 알림
      socket.emit('updateForNewUser', `${newUser}(나)님이 입장했습니다.`);
      // 전체 접속자에게 user가 채팅방에 입장했음을 알림
      socket.broadcast.emit('updateForEveryone', `${newUser}가 도착했습니다.`);
    });
    // 메시지 전송 발생
    socket.on('chat message', (data: any) => {
      // user 화면에 메시지 송출
      socket.emit('chat message', `나: ${data.msg}`);
      // 다른 접속자 화면에 메시지 송출
      socket.broadcast.emit('chat message', `${data.name}: ${data.msg}`);
      const chatInfo = {
        roomType: 'main',
        username: `${data.name}`,
        message: `${data.msg}`,
        time: new Date().getHours().toString(),
        image: 'no image',
      };
      chatService.addChat(chatInfo);
    });
  });
  // socket 연결 종료
  io.sockets.on('disconnect', () => {
    console.log('연결이 종료되었습니다.');
  });
}

export default webSocket;
