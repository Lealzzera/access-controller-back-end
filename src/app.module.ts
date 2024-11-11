import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChildrenModule } from './modules/children/children.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';
import { ResponsibleOnChildrenModule } from './modules/responsible-on-children/responsible-on-children.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ChildrenModule,
    InstitutionsModule,
    ResponsibleModule,
    ResponsibleOnChildrenModule,
  ],
})
export class AppModule {}
