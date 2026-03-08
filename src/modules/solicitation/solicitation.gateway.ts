import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.ACCESS_CONTROLLER_FRONT_END,
    credentials: true,
  },
  namespace: '/solicitations',
})
export class SolicitationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SolicitationGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload;

      if (payload.role === 'INSTITUTION') {
        client.join(`institution:${payload.sub}`);
        this.logger.log(`Institution ${payload.sub} connected`);
      } else if (payload.role === 'RESPONSIBLE') {
        client.join(`responsible:${payload.sub}`);
        this.logger.log(`Responsible ${payload.sub} connected`);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user) {
      this.logger.log(`${user.role} ${user.sub} disconnected`);
    }
  }

  notifyInstitution(institutionId: string, payload: { event: string; data: any }) {
    this.server
      .to(`institution:${institutionId}`)
      .emit(payload.event, payload.data);
  }

  notifyResponsible(responsibleId: string, payload: { event: string; data: any }) {
    this.server
      .to(`responsible:${responsibleId}`)
      .emit(payload.event, payload.data);
  }
}
