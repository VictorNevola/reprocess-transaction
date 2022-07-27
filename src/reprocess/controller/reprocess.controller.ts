import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ReprocessService } from '../service/reprocess.service';
import { UpdateReprocessDto } from '../dto/update-reprocess.dto';

@Controller('reprocess')
export class ReprocessController {
  constructor(private readonly reprocessService: ReprocessService) {}

  @Get()
  findAll() {
    return this.reprocessService.findAll();
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReprocessDto: UpdateReprocessDto,
  // ) {
  //   return this.reprocessService.update(+id, updateReprocessDto);
  // }
}
