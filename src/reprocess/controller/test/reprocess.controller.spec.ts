import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ReprocessController } from '../reprocess.controller';
import { ReprocessService } from '../../service/reprocess.service';
import { mockControllerFindAllSuccess } from './mocks';
import { firstValueFrom, Observable } from 'rxjs';

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
          s.next(expected);
          s.complete();
        });
      });

      const result = await firstValueFrom(controller.findAll());
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
        const result = await firstValueFrom(controller.findAll());
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
});
