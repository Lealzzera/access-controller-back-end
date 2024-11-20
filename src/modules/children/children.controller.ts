import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { RegisterChildDTO } from './register.dto';
import { RegisterService } from './use-cases/register.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller({
  path: 'children',
  version: '1',
})
@UseGuards(AuthGuard)
export class ChildrenController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/register')
  @HttpCode(201)
  @Role('INSTITUTION')
  async register(
    @Body()
    {
      name,
      cpf,
      grade,
      teacher,
      birthDate,
      picture,
      period,
      institutionId,
      responsible,
    }: RegisterChildDTO,
  ) {
    try {
      await this.registerService.exec({
        name,
        cpf,
        grade,
        teacher,
        birthDate,
        picture,
        period,
        institutionId,
        responsible,
      });
    } catch (err) {
      return err.response;
    }
  }
}
