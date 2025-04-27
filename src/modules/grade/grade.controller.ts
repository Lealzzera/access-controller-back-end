import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FetchGradesByInstitutionIdService } from './use-cases/fetch-grades-by-institution-id.service';
import { Role } from 'src/decorators/role.decorator';

@Controller({
  path: 'grade',
  version: '1',
})
@UseGuards(AuthGuard)
export class GradeController {
  constructor(
    private readonly fetchGradesByInstitutionIdService: FetchGradesByInstitutionIdService,
  ) {}

  @Get('/:institutionId')
  @Role('INSTITUTION')
  async fetchGrades(@Param('institutionId') institutionId: string) {
    const grades = await this.fetchGradesByInstitutionIdService.exec({
      institutionId,
    });
    return grades;
  }
}
