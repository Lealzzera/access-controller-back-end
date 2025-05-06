import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import FetchAllKinshipService from './use-cases/fetch-all-kinship.service';
import RegisterKinshipService from './use-cases/register-kinship.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller({
  version: '1',
  path: 'kinship',
})
@UseGuards(AuthGuard)
export class KinshipController {
  constructor(
    private readonly fetchAllKinshipService: FetchAllKinshipService,
    private readonly registerKinshipService: RegisterKinshipService,
  ) {}

  @Post()
  async register(@Body() { name, value }: { name: string; value: number }) {
    await this.registerKinshipService.exec({ name, value });
  }

  @Get()
  async fetchAllKinshipList() {
    const { kinships } = await this.fetchAllKinshipService.exec();
    return { kinship: kinships };
  }
}
