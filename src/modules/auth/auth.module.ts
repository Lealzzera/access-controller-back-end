import { Module } from '@nestjs/common';
import { ResponsibleRepository } from '../responsible/repositories/responsible.repository';
import { InstitutionsRepository } from '../institutions/repositories/institutions.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20d' },
    }),
  ],
  providers: [
    AuthService,
    { provide: 'IResponsibleRepository', useClass: ResponsibleRepository },
    { provide: 'IInstitutionsRepository', useClass: InstitutionsRepository },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
