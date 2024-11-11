import { Body, Controller, Post } from '@nestjs/common';
import { CreateResponsibleDTO } from '../dto/create-responsible.dto';

@Controller({
  version: '1',
  path: 'responsible',
})
export class ResponsibleController {
  @Post('/register')
  async createResponsible(
    @Body()
    {
      name,
      email,
      password,
      street,
      neighborhood,
      city,
      state,
      cep,
      picture,
    }: CreateResponsibleDTO,
  ) {}
}
