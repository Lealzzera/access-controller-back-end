import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { CreateResponsibleDTO } from './create-responsible.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller({
  version: '1',
  path: 'responsible',
})
export class ResponsibleController {
  constructor(
    private readonly registerResponsibleService: RegisterResponsibleService,
  ) {}
  @Post('/register')
  @Role('RESPONSIBLE')
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
      return err.response;
    }
  }
}
