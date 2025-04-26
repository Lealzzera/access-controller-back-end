import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegisterChildDTO } from './register.dto';
import { RegisterService } from './use-cases/register.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { FetchChildrenByInstitutionIdService } from './use-cases/fetch-children-by-institution-id.service';
import { FetchChildrenByResponsibleIdService } from './use-cases/fetch-children-by-responsible-id.service';

@Controller({
  path: 'children',
  version: '1',
})
@UseGuards(AuthGuard)
export class ChildrenController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly fetchChildrenByInstitutionIdService: FetchChildrenByInstitutionIdService,
    private readonly fetchChildrenByResponsibleIdService: FetchChildrenByResponsibleIdService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  @Role('INSTITUTION')
  async register(
    @Body()
    {
      name,
      cpf,
      gradeId,
      birthDate,
      picture,
      periodId,
      institutionId,
    }: RegisterChildDTO,
  ) {
    try {
      await this.registerService.exec({
        name,
        cpf,
        gradeId,
        periodId,
        birthDate,
        picture,
        institutionId,
      });
    } catch (err) {
      return err.response;
    }
  }

  @Get()
  @Role('INSTITUTION')
  async fetchChildrenByInstitutionId(
    @Query('institutionId') institutionId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      const children = await this.fetchChildrenByInstitutionIdService.exec({
        institutionId,
        page,
        limit,
      });

      return children;
    } catch (err) {
      return err.response;
    }
  }

  @Get('by-responsible-id/:responsibleId')
  @Role('RESPONSIBLE')
  async fetchChildrenByResponsibleId(
    @Param('responsibleId') responsibleId: string,
  ) {
    try {
      const children =
        this.fetchChildrenByResponsibleIdService.exec(responsibleId);
      return children;
    } catch (err) {
      return err.response;
    }
  }
}
