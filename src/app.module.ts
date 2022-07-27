import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReprocessModule } from './reprocess/reprocess.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ReprocessModule,
  ],
})
export class AppModule {}
