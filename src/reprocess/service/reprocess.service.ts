import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
// import { UpdateReprocessDto } from '../dto/update-reprocess.dto';

@Injectable()
export class ReprocessService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    return this.httpService
      .get(
        this.configService.getOrThrow<string>(
          'URL_TRANSACTIONS_AWAITING_REPROCESSING',
        ),
      )
      .pipe(map((response) => response.data));
  }

  // update(id: number, updateReprocessDto: UpdateReprocessDto) {
  //   return `This action updates a #${id} reprocess`;
  // }
}
