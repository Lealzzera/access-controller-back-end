import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
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
import { UpdateChildService } from './use-cases/update-child.service';
import { UpdateChildDTO } from './update-child.dto';

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
    private readonly updateChildService: UpdateChildService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  @Role('INSTITUTION')
  async register(@Body() body: RegisterChildDTO) {
    return this.registerService.exec(body);
  }

  @Get()
  @Role('INSTITUTION')
  async fetchChildrenByInstitutionId(
    @Query('institutionId') institutionId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.fetchChildrenByInstitutionIdService.exec({
      institutionId,
      page,
      limit,
    });
  }

  @Get('by-responsible-id/:responsibleId')
  @Role('RESPONSIBLE')
  async fetchChildrenByResponsibleId(
    @Param('responsibleId') responsibleId: string,
  ) {
    return this.fetchChildrenByResponsibleIdService.exec(responsibleId);
  }

  @Patch('/:id')
  @Role('INSTITUTION')
  async updateChildren(@Param('id') id: string, @Body() body: UpdateChildDTO) {
    const { child } = await this.updateChildService.exec({
      id,
      ...body,
    });

    return child;
  }
}
