import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get('role', context.getHandler());
    const authorization = context.switchToHttp().getRequest()
      .headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(
        authorization.split(' ')[1],
        {
          secret: process.env.JWT_SECRET,
        },
      );

      if (requiredRole && requiredRole !== payload.role) {
        throw new ForbiddenException('Users does not have this permission');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
