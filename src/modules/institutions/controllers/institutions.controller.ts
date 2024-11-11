import { Body, Controller, Post } from '@nestjs/common';
import { RegisterInstitutionDTO } from '../dto/register-institution.dto';
import { RegisterInstitutionService } from '../use-cases/register.service';

@Controller({
  path: 'institution',
  version: '1',
})
export class InstitutionController {
  constructor(
    private readonly registerInstitutionService: RegisterInstitutionService,
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
      return err;
    }
  }
}
