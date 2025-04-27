import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChildrenModule } from './modules/children/children.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInfoModule } from './modules/userInfo/userInfo.module';
import { UploadModule } from './modules/upload/upload.module';
import { DownLoadModule } from './modules/download/download.module';
import { GradeModule } from './modules/grade/grade.module';

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
    UploadModule,
    DownLoadModule,
    GradeModule,
  ],
})
export class AppModule {}
