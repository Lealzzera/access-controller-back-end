import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterService } from '../use-cases/register.service';
import { RegisterChildDTO } from '../dto/register.dto';

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
      });
    } catch (err) {
      return err;
    }
  }
}
