import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FetchGradesByInstitutionIdService } from './use-cases/fetch-grades-by-institution-id.service';
import { Role } from 'src/decorators/role.decorator';
import { CreateGradeService } from './use-cases/create-grade.service';

@Controller({
  path: 'grade',
  version: '1',
})
@UseGuards(AuthGuard)
export class GradeController {
  constructor(
    private readonly fetchGradesByInstitutionIdService: FetchGradesByInstitutionIdService,
    private readonly createGradeService: CreateGradeService,
  ) {}

  @Get('/:institutionId')
  @Role('INSTITUTION')
  async fetchGrades(@Param('institutionId') institutionId: string) {
    const grades = await this.fetchGradesByInstitutionIdService.exec({
      institutionId,
    });
    return grades;
  }

  @Post('/create')
  @Role('INSTITUTION')
  async createGrade(@Body() body: { name: string; institutionId: string }) {
    console.log('bateu aqui', body)
    const grade = await this.createGradeService.exec({
      name: body.name,
      institutionId: body.institutionId,
    });
    return grade;
  }
}
