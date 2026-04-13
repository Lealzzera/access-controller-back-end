import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FetchGradesByInstitutionIdService } from './use-cases/fetch-grades-by-institution-id.service';
import { Role } from 'src/decorators/role.decorator';
import { CreateGradeService } from './use-cases/create-grade.service';
import { DeleteGradeService } from './use-cases/delete-grade.service';

@Controller({
  path: 'grade',
  version: '1',
})
@UseGuards(AuthGuard)
export class GradeController {
  constructor(
    private readonly fetchGradesByInstitutionIdService: FetchGradesByInstitutionIdService,
    private readonly createGradeService: CreateGradeService,
    private readonly deleteGradeService: DeleteGradeService,
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
    const grade = await this.createGradeService.exec({
      name: body.name,
      institutionId: body.institutionId,
    });
    return grade;
  }

  @Delete('/delete/:gradeId')
  @Role('INSTITUTION')
  async deleteGrade(@Param('gradeId') gradeId: string) {
    const grade = await this.deleteGradeService.exec({ gradeId });
    return grade;
  }
}
