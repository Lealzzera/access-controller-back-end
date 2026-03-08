import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/decorators/role.decorator';
import { CreateSolicitationDTO } from './create-solicitation.dto';
import { CreateSolicitationService } from './use-cases/create-solicitation.service';
import { AcceptSolicitationService } from './use-cases/accept-solicitation.service';
import { RejectSolicitationService } from './use-cases/reject-solicitation.service';
import { FetchPendingSolicitationsService } from './use-cases/fetch-pending-solicitations.service';

@Controller({
  path: 'solicitation',
  version: '1',
})
@UseGuards(AuthGuard)
export class SolicitationController {
  constructor(
    private readonly createSolicitationService: CreateSolicitationService,
    private readonly acceptSolicitationService: AcceptSolicitationService,
    private readonly rejectSolicitationService: RejectSolicitationService,
    private readonly fetchPendingSolicitationsService: FetchPendingSolicitationsService,
  ) {}

  @Post('/')
  @HttpCode(201)
  @Role('RESPONSIBLE')
  async create(@Body() body: CreateSolicitationDTO, @Req() req: any) {
    return this.createSolicitationService.exec({
      ...body,
      responsibleId: req.user.sub,
    });
  }

  @Patch('/:solicitationId/accept')
  @Role('INSTITUTION')
  async accept(@Param('solicitationId') solicitationId: string) {
    return this.acceptSolicitationService.exec({ solicitationId });
  }

  @Patch('/:solicitationId/reject')
  @Role('INSTITUTION')
  async reject(@Param('solicitationId') solicitationId: string) {
    return this.rejectSolicitationService.exec({ solicitationId });
  }

  @Get('/pending/:institutionId')
  @Role('INSTITUTION')
  async fetchPending(@Param('institutionId') institutionId: string) {
    return this.fetchPendingSolicitationsService.exec({ institutionId });
  }
}
