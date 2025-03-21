import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server!: Server;

  sendOperationMessage(message: string) {
    this.server.emit('operation', message);
  }
}
