import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FetchPeriodsByInstitutionIdService } from './use-cases/fetch-periods-by-institution-id.service';
import { Role } from 'src/decorators/role.decorator';
import { CreatePeriodService } from './use-cases/create-period.service';
import { DeletePeriodService } from './use-cases/delete-period.service';

@Controller({
  path: 'period',
  version: '1',
})
@UseGuards(AuthGuard)
export class PeriodController {
  constructor(
    private readonly fetchPeriodsByInstitutionIdService: FetchPeriodsByInstitutionIdService,
    private readonly createPeriodService: CreatePeriodService,
    private readonly deletePeriodService: DeletePeriodService,
  ) {}

  @Get('/:institutionId')
  @Role('INSTITUTION')
  async fetchPeriods(@Param('institutionId') institutionId: string) {
    const periods = await this.fetchPeriodsByInstitutionIdService.exec({
      institutionId,
    });
    return periods;
  }

  @Post('/create')
  @Role('INSTITUTION')
  async createPeriod(@Body() body: { name: string; institutionId: string }) {
    const period = await this.createPeriodService.exec({
      name: body.name,
      institutionId: body.institutionId,
    });
    return period;
  }

  @Delete('/delete/:periodId')
  @Role('INSTITUTION')
  async deletePeriod(@Param('periodId') periodId: string) {
    const period = await this.deletePeriodService.exec({ periodId });
    return period;
  }
}
