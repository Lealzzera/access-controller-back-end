import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  async register(
    @Body()
    {
      name,
      email,
      cep,
      city,
      cnpj,
      neighborhood,
      password,
      picture,
      responsible,
      state,
      street,
    }: RegisterInstitutionDTO,
  ) {
    try {
      await this.registerInstitutionService.exec({
        name,
        email,
        cep,
        city,
        cnpj,
        neighborhood,
        password,
        picture,
        responsible,
        state,
        street,
      });
    } catch (err) {
      return err.response;
    }
  }

  @Get('')
  async getInstitutionById(@Query('institutionId') institutionId: string) {
    try {
      const institution = await this.getInstitutionByIdService.exec({
        institutionId,
      });
      return institution;
    } catch (err) {
      return err.response;
    }
  }
}
