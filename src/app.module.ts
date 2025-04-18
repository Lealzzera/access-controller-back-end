import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChildrenModule } from './modules/children/children.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInfoModule } from './modules/userInfo/userInfo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ChildrenModule,
    InstitutionsModule,
    ResponsibleModule,
    AuthModule,
    UserInfoModule,
  ],
})
export class AppModule {}
