import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sessions')
  @HttpCode(200)
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body()
    { email, password }: { email: string; password: string },
  ) {
    try {
      const { access_token } = await this.authService.generateToken({
        email,
        password,
      });
      const cookieExpirationIsTwentyDays = 1000 * 60 * 60 * 24 * 20;

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'dev',
        sameSite: 'lax',
        maxAge: cookieExpirationIsTwentyDays,
      });

      return { access_token, statusCode: 200 };
    } catch (err) {
      return err.response;
    }
  }
}
