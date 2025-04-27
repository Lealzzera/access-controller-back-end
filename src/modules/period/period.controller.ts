import { Controller, Get, Param } from '@nestjs/common';
import { FetchPeriodsByInstitutionIdService } from './use-cases/fetch-periods-by-institution-id.service';

@Controller({
  path: 'period',
  version: '1',
})
export class PeriodController {
  constructor(
    private readonly fetchPeriodsByInstitutionIdService: FetchPeriodsByInstitutionIdService,
  ) {}

  @Get('/:institutionId')
  async fetchPeriods(@Param('institutionId') institutionId: string) {
    const periods = await this.fetchPeriodsByInstitutionIdService.exec({
      institutionId,
    });
    return periods;
  }
}
