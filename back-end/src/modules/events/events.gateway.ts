import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

const options = {
  origins: ['*'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};
@WebSocketGateway(options)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('EventsGateway');

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.server.emit('events', data);
    return data;
  }

  @SubscribeMessage('new-message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const newMessage = {
      from_user: 'chatbot',
      to_user: data.from_user,
      message: data.message,
      timestamp: data.timestamp,
    };

    this.server.emit('new-message', newMessage);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
