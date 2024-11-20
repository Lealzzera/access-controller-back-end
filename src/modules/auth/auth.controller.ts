import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sessions')
  @HttpCode(200)
  async signIn(
    @Body() { email, password }: { email: string; password: string },
  ) {
    try {
      const user = await this.authService.generateToken({ email, password });
      return user;
    } catch (err) {
      return err.response;
    }
  }
}
