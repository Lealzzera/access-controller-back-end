import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterChildDTO } from './register.dto';
import { RegisterService } from './use-cases/register.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { FetchChildrenByInstitutionIdService } from './use-cases/fetch-children-by-institution-id.service';
import { FetchChildrenByInstitutionIdCursorPaginatedService } from './use-cases/fetch-children-by-institution-id-cursor-paginated.service';
import { FetchChildrenByResponsibleIdService } from './use-cases/fetch-children-by-responsible-id.service';
import { UpdateChildService } from './use-cases/update-child.service';
import { UpdateChildDTO } from './update-child.dto';
import { GetChildrenDTO } from './get-children.dto';

@Controller({
  path: 'children',
  version: '1',
})
@UseGuards(AuthGuard)
export class ChildrenController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly fetchChildrenByInstitutionIdService: FetchChildrenByInstitutionIdService,
    private readonly fetchChildrenByInstitutionIdCursorPaginatedService: FetchChildrenByInstitutionIdCursorPaginatedService,
    private readonly fetchChildrenByResponsibleIdService: FetchChildrenByResponsibleIdService,
    private readonly updateChildService: UpdateChildService,
  ) {}

  @Get('/')
  @Role('INSTITUTION')
  async fetchChildrenByInstitutionId(
    @Query() query: GetChildrenDTO,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string,
  ) {
    return this.fetchChildrenByInstitutionIdCursorPaginatedService.exec({
      institutionId: query.institutionId,
      cursor,
      take: take ? Number(take) : 10,
    });
  }

  @Post('/register')
  @HttpCode(201)
  @Role('INSTITUTION')
  @UseInterceptors(FileInterceptor('picture'))
  async register(
    @Body() body: RegisterChildDTO,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.registerService.exec({ ...body, picture });
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
