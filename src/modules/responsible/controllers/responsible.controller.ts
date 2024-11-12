import { Body, Controller, Post } from '@nestjs/common';
import { CreateResponsibleDTO } from '../dto/create-responsible.dto';
import { RegisterResponsibleService } from '../use-cases/register-responsible.service';

@Controller({
  version: '1',
  path: 'responsible',
})
export class ResponsibleController {
  constructor(
    private readonly registerResponsibleService: RegisterResponsibleService,
  ) {}
  @Post('/register')
  async createResponsible(
    @Body()
    {
      institutionId,
      childId,
      name,
      email,
      password,
      street,
      neighborhood,
      city,
      state,
      cep,
      picture,
      cpf,
      kinship,
    }: CreateResponsibleDTO,
  ) {
    try {
      await this.registerResponsibleService.exec({
        institutionId,
        childId,
        name,
        email,
        password,
        street,
        neighborhood,
        city,
        state,
        cep,
        picture,
        cpf,
        kinship,
      });
    } catch (err) {
      return err;
    }
  }
}
