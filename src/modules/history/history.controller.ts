import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { FetchHistoryByInstitutionIdService } from './use-cases/fetch-history-by-institution-id.service';

@Controller({
  path: 'history',
  version: '1',
})
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(
    private readonly fetchHistoryByInstitutionIdService: FetchHistoryByInstitutionIdService,
  ) {}

  @Get('/institution/:institutionId')
  @Role('INSTITUTION')
  async fetchHistoryByInstitution(
    @Param('institutionId') institutionId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const history = await this.fetchHistoryByInstitutionIdService.exec({
      institutionId,
      dateFrom,
      dateTo,
    });

    return { history };
  }
}
