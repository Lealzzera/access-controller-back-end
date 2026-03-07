import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterInstitutionDTO } from './register-institution.dto';
import { ConfigureInstitutionDTO } from './configure-institution.dto';
import { RegisterInstitutionService } from './use-cases/register.service';
import { GetInstitutionByIdService } from './use-cases/get-institution-by-id.service';
import { ConfigureInstitutionService } from './use-cases/configure-institution.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';

@Controller({
  path: 'institution',
  version: '1',
})
@UseGuards(AuthGuard)
export class InstitutionController {
  constructor(
    private readonly registerInstitutionService: RegisterInstitutionService,
    private readonly getInstitutionByIdService: GetInstitutionByIdService,
    private readonly configureInstitutionService: ConfigureInstitutionService,
  ) {}
  @Post('/register')
  async register(@Body() body: RegisterInstitutionDTO) {
    await this.registerInstitutionService.exec(body);
  }

  @Get('/:institutionId')
  async getInstitutionById(@Param('institutionId') institutionId: string) {
    return this.getInstitutionByIdService.exec({ institutionId });
  }

  @Post('/configure')
  @HttpCode(201)
  @Role('INSTITUTION')
  async configure(@Body() body: ConfigureInstitutionDTO) {
    return this.configureInstitutionService.exec(body);
  }
}
