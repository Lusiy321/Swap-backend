import { Server } from 'socket.io';
export declare class ChatGateway {
    server: Server;
    handleJoinChat(client: any, roomId: string): void;
    handleChatMessage(client: any, message: string): void;
}
