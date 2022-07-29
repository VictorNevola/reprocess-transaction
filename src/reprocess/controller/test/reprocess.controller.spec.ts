import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { firstValueFrom, Observable } from 'rxjs';

import { ReprocessController } from '../reprocess.controller';
import { ReprocessService } from '../../service/reprocess.service';
import {
  mockControllerFindAllSuccess,
  mockServiceResolvedsValues,
} from './mocks';

const moduleMocker = new ModuleMocker(global);

describe('ReprocessController', () => {
  let controller: ReprocessController;
  let service: ReprocessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReprocessController],
      providers: [ReprocessService],
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

    controller = module.get<ReprocessController>(ReprocessController);
    service = module.get<ReprocessService>(ReprocessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ReprocessController - GET', () => {
    it('should return success status and an array of reprocesses', async () => {
      const expected = mockControllerFindAllSuccess(200, true);
      jest.spyOn(service, 'findAll').mockImplementationOnce(() => {
        return new Observable((s) => {
          s.next(expected as any);
          s.complete();
        });
      });

      const result: any = await firstValueFrom(controller.findAll());
      expect(result.status).toEqual(200);
      expect(result.data).toEqual(expected.data);
    });

    it('should return error status and message', async () => {
      const expectedError = mockControllerFindAllSuccess(500, false);
      jest.spyOn(service, 'findAll').mockImplementationOnce(() => {
        return new Observable((s) => {
          s.error(expectedError);
        });
      });

      try {
        const result: any = await firstValueFrom(controller.findAll());
        expect(result.status).toEqual(500);
      } catch (error) {
        expect(error.status).toEqual(500);
        expect(error.data).toEqual(
          expect.objectContaining({
            statusCode: 500,
            message: 'Internal server error',
          }),
        );
      }
    });
  });

  describe('ReprocessController - PATCH', () => {
    it('should return success status and an array of reprocesses', async () => {
      jest
        .spyOn(service, 'reprocessTransaction')
        .mockResolvedValue(mockServiceResolvedsValues);

      const result = await controller.update({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(result).toBeDefined();
      expect(result).toHaveLength(5);
      expect(result).toEqual(mockServiceResolvedsValues);
    });
  });
});
