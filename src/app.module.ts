import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReprocessModule } from './reprocess/reprocess.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ReprocessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
