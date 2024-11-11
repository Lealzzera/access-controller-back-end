import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChildrenModule } from './modules/children/children.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ChildrenModule,
  ],
})
export class AppModule {}
