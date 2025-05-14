import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterResponsibleService } from './use-cases/register-responsible.service';
import { CreateResponsibleDTO } from './create-responsible.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { GetResponsibleDataService } from './use-cases/get-responsible-data.service';
import { UpdateResponsibleDTO } from './update-responsible.dto';
import { UpdateResponsibleService } from './use-cases/update-responsible.service';
import { GetResponsiblesService } from './use-cases/get-responsibles.service';

@UseGuards(AuthGuard)
@Controller({
  version: '1',
  path: 'responsible',
})
export class ResponsibleController {
  constructor(
    private readonly registerResponsibleService: RegisterResponsibleService,
    private readonly getResponsibleDataService: GetResponsibleDataService,
    private readonly updateResponsibleService: UpdateResponsibleService,
    private readonly getResponsiblesService: GetResponsiblesService,
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
      picture,
      cpf,
      kinshipId,
    }: CreateResponsibleDTO,
  ) {
    try {
      const { responsible } = await this.registerResponsibleService.exec({
        institutionId,
        childId,
        name,
        email,
        password,
        picture,
        cpf,
        kinshipId,
      });
      return { responsible };
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

  @Patch('/:id')
  @Role('INSTITUTION')
  async updateChildren(
    @Param('id') id: string,
    @Body() { name, picture, password }: UpdateResponsibleDTO,
  ) {
    const { responsible } = await this.updateResponsibleService.exec({
      id,
      name,
      picture,
      password,
    });

    return responsible;
  }

  @Get('/by-child-id/:childId')
  @Role('INSTITUTION')
  async getResponsibleList(@Param('childId') childId: string) {
    try {
      const responsible = await this.getResponsiblesService.exec(childId);

      return responsible;
    } catch (err) {
      return err.response;
    }
  }
}
