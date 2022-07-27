import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { firstValueFrom, Observable } from 'rxjs';
import { ReprocessService } from '../reprocess.service';
import { mockListClientAwaitingReprocess } from './mocks';

const moduleMocker = new ModuleMocker(global);

describe('ReprocessService', () => {
  let httpService: HttpService;
  let service: ReprocessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
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

    service = module.get<ReprocessService>(ReprocessService);
    httpService = module.get<HttpService>(HttpService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('ReprocessService - findAll', () => {
    it('should return list all clients awaiting transactions reprocess', async () => {
      const result = {
        data: mockListClientAwaitingReprocess,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      const httpRequest = jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => {
          return new Observable((s) => {
            s.next(result);
            s.complete();
          });
        });

      const response = await firstValueFrom(service.findAll());
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockListClientAwaitingReprocess);
      expect(response).toHaveLength(4);
    });

    it('should return failed when fetch list all clients', async () => {
      const err = {
        config: {},
        code: '500',
        message: 'internal server error',
      };

      const httpRequest = jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => {
          return new Observable((s) => {
            s.error(err);
          });
        });

      try {
        const response = await firstValueFrom(service.findAll());
        expect(response).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(err);
      }

      expect(httpRequest).toHaveBeenCalledTimes(1);
    });
  });
});
