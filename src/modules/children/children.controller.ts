import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterChildDTO } from './register.dto';
import { RegisterService } from './use-cases/register.service';

@Controller({
  path: 'children',
  version: '1',
})
export class ChildrenController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/register')
  @HttpCode(201)
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
