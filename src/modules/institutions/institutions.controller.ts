import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterInstitutionDTO } from './register-institution.dto';
import { ConfigureInstitutionDTO } from './configure-institution.dto';
import { RegisterInstitutionService } from './use-cases/register.service';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';
import { ConfigureInstitutionService } from './use-cases/configure-institution.service';
import { DeletePeriodService } from './use-cases/delete-period.service';
import { DeleteGradeService } from './use-cases/delete-grade.service';
import { UpdatePeriodService } from './use-cases/update-period.service';
import { UpdateGradeService } from './use-cases/update-grade.service';
import { UpdatePeriodDTO } from './update-period.dto';
import { UpdateGradeDTO } from './update-grade.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller({
  path: 'institution',
  version: '1',
})
export class InstitutionController {
  constructor(
    private readonly registerInstitutionService: RegisterInstitutionService,
    private readonly getInstitutionByIdService: GetInstitutionByIdService,
    private readonly configureInstitutionService: ConfigureInstitutionService,
    private readonly deletePeriodService: DeletePeriodService,
    private readonly deleteGradeService: DeleteGradeService,
    private readonly updatePeriodService: UpdatePeriodService,
    private readonly updateGradeService: UpdateGradeService,
  ) {}
  @Post('/register')
  async register(@Body() body: RegisterInstitutionDTO) {
    await this.registerInstitutionService.exec(body);
  }

  @Get('/:institutionId')
  @UseGuards(AuthGuard)
  async getInstitutionById(@Param('institutionId') institutionId: string) {
    return this.getInstitutionByIdService.exec({ institutionId });
  }

  @Post('/configure')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Role('INSTITUTION')
  async configure(@Body() body: ConfigureInstitutionDTO) {
    return this.configureInstitutionService.exec(body);
  }

  @Delete('/period/:periodId')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Role('INSTITUTION')
  async deletePeriod(@Param('periodId') periodId: string) {
    await this.deletePeriodService.exec({ periodId });
  }

  @Delete('/grade/:gradeId')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Role('INSTITUTION')
  async deleteGrade(@Param('gradeId') gradeId: string) {
    await this.deleteGradeService.exec({ gradeId });
  }

  @Patch('/period/:periodId')
  @UseGuards(AuthGuard)
  @Role('INSTITUTION')
  async updatePeriod(
    @Param('periodId') periodId: string,
    @Body() body: UpdatePeriodDTO,
  ) {
    return this.updatePeriodService.exec({ periodId, ...body });
  }

  @Patch('/grade/:gradeId')
  @UseGuards(AuthGuard)
  @Role('INSTITUTION')
  async updateGrade(
    @Param('gradeId') gradeId: string,
    @Body() body: UpdateGradeDTO,
  ) {
    return this.updateGradeService.exec({ gradeId, ...body });
  }
}
