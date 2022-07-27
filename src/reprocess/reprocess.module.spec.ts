import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ReprocessController } from './controller/reprocess.controller';
import { ReprocessModule } from './reprocess.module';
import { ReprocessService } from './service/reprocess.service';

const moduleMocker = new ModuleMocker(global);

describe('ReprocessService', () => {
  it('should compile the module with required instances', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ReprocessModule],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    expect(module).toBeDefined();
    expect(module.get(ReprocessService)).toBeInstanceOf(ReprocessService);
    expect(module.get(ReprocessController)).toBeInstanceOf(ReprocessController);
  });
});
