import { Test, TestingModule } from '@nestjs/testing';
import { ReprocessController } from '../reprocess.controller';
import { ReprocessService } from '../../service/reprocess.service';

describe('ReprocessController', () => {
  let controller: ReprocessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReprocessController],
      providers: [ReprocessService],
    }).compile();

    controller = module.get<ReprocessController>(ReprocessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
