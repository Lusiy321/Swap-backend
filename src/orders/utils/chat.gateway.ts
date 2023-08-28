/* eslint-disable prettier/prettier */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinChat')
  handleJoinChat(client: any, roomId: string) {
    client.join(roomId);
    client.emit('chatMessage', 'You have joined the chat.');
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: any, message: string) {
    const roomId = '1';
    this.server.to(roomId).emit('chatMessage', message);
  }
}
