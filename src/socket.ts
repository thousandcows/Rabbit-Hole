import * as http from 'http';
import { Server } from 'socket.io';
// import { chatService } from "./services";

interface clientsListInfo {
  [key: string]: string;
}

function webSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // 현재 접속자 목록
  const clientsList: clientsListInfo = {};

  // socket 연결중
  io.sockets.on('connection', (socket: any) => {
    // 새로운 접속자 발생
    socket.on('newUser', (newUser: string) => {
      // 접속자의 name 속성에 이름 저장
      // eslint-disable-next-line no-param-reassign
      socket.name = newUser;
      // 현재 접속자 수
      const { clientsCount } = io.sockets.server.engine;
      // 현재 접속자 목록에 새로운 접속자 추가
      io.sockets.sockets.forEach((data: any) => {
        clientsList[data.name] = data.name;
      });

      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;

      // 새로운 접속자 나에게 알림
      socket.emit('update', {
        msg: `${newUser}(나)님이 접속했습니다.`,
        clientsCount,
        clientsList,
        time: now,
      });

      // 새로운 접속자 다른사람들에게 알림
      socket.broadcast.emit('update', {
        msg: `${newUser}님이 접속했습니다.`,
        clientsCount,
        clientsList,
        time: now,
      });
    });

    // 메세지 전송 발생
    socket.on('chat message', (data: any) => {
      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;

      // 다른사람 화면에 보여지는 메세지
      socket.broadcast.emit('chat message', {
        msg: `${data.name}: ${data.msg}`,
        time: now,
      });
      // 내 화면에 보여지는 메세지
      socket.emit('chat message', {
        msg: `나: ${data.msg}`,
        time: now,
      });

      //   chatService.addChat({
      //     nickname: data.name,
      //     message: data.msg,
      //     time: now,
      //   });
    });

    // 접속자 채팅 종료
    socket.on('disconnect', () => {
      // 현재 접속자 수
      const { clientsCount } = io.sockets.server.engine;

      // 채팅 종료한 사람은 접속자 목록에서 삭제
      delete clientsList[socket.name];

      // 현재 시간
      const today = new Date(); // 현재 시간
      const hours = today.getHours(); // 시
      const minutes = today.getMinutes(); // 분
      const now = `${hours}:${minutes}`;

      // 채팅 종료한 접속자를 다른사람들에게 알림
      if (socket.name) {
        socket.broadcast.emit('update', {
          msg: `${socket.name}님이 나가셨습니다.`,
          clientsCount,
          clientsList,
          time: now,
        });
      }
    });
  });
}

export default webSocket;
