import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterInstitutionDTO } from './register-institution.dto';
import { RegisterInstitutionService } from './use-cases/register.service';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';

@Controller({
  path: 'institution',
  version: '1',
})
export class InstitutionController {
  constructor(
    private readonly registerInstitutionService: RegisterInstitutionService,
    private readonly getInstitutionByIdService: GetInstitutionByIdService,
  ) {}
  @Post('/register')
  async register(@Body() body: RegisterInstitutionDTO) {
    await this.registerInstitutionService.exec(body);
  }

  @Get('/:institutionId')
  async getInstitutionById(@Param('institutionId') institutionId: string) {
    return this.getInstitutionByIdService.exec({ institutionId });
  }
}
