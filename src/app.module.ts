import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChildrenModule } from './modules/children/children.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInfoModule } from './modules/userInfo/userInfo.module';
import { GradeModule } from './modules/grade/grade.module';
import { PeriodModule } from './modules/period/period.module';
import { KinshipModule } from './modules/kinship/kinship.module';
import { S3Module } from './aws/s3/s3.module';

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
    GradeModule,
    PeriodModule,
    KinshipModule,
    S3Module,
  ],
})
export class AppModule {}
