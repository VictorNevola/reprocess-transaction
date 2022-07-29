import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ReprocessService } from '../service/reprocess.service';
import { ReprocessDto } from '../dto/update-reprocess.dto';

@Controller('reprocess')
export class ReprocessController {
  constructor(private readonly reprocessService: ReprocessService) {}

  @Get()
  findAll() {
    return this.reprocessService.findAll();
  }

  @Patch()
  update(@Body() updateReprocessDto: ReprocessDto) {
    return this.reprocessService.reprocessTransaction(updateReprocessDto);
  }
}
