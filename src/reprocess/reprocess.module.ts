import { Module } from '@nestjs/common';
import { ReprocessService } from './service/reprocess.service';
import { ReprocessController } from './controller/reprocess.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ReprocessController],
  providers: [ReprocessService],
})
export class ReprocessModule {}
