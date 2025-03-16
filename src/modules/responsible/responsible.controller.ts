import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { CreateResponsibleDTO } from './create-responsible.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { GetResponsibleDataService } from './use-cases/get-responsible-data.service';

@UseGuards(AuthGuard)
@Controller({
  version: '1',
  path: 'responsible',
})
export class ResponsibleController {
  constructor(
    private readonly registerResponsibleService: RegisterResponsibleService,
    private readonly getResponsibleDataService: GetResponsibleDataService,
  ) {}
  @Post('/register')
  @Role('INSTITUTION')
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
  @Get('/:responsibleId')
  async getResponsibleData(@Param('responsibleId') responsibleId: string) {
    try {
      const responsible = await this.getResponsibleDataService.exec({
        responsibleId,
      });
      return { responsible };
    } catch (err) {
      return err.response;
    }
  }
}
