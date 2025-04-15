import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller({
  path: 'me',
  version: '1',
})
export class UserInfoController {
  @Get()
  @HttpCode(200)
  async getUserInformation(@Req() req) {
    return {
      id: req.user.sub,
      role: req.user.role,
    };
  }
}
