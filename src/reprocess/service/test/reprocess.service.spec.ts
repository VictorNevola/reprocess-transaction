import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { firstValueFrom } from 'rxjs';
import { ReprocessService } from '../reprocess.service';
import {
  mockListClientAwaitingReprocess,
  mockResultListClients,
  mockHttpRequestNest,
  mockResultListBanks,
  mockListBanks,
  mockResultUserBalance,
  mockUserTransaction,
} from './mocks';

import { EnumStatusTransaction } from '../types/transactions.type';

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

  describe('Method - findAll', () => {
    it('should return list all clients awaiting transactions reprocess', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );

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

      const httpRequest = mockHttpRequestNest(httpService, 'get', err, true);

      try {
        const response = await firstValueFrom(service.findAll());
        expect(response).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(err);
      }

      expect(httpRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Method - findAllBanks', () => {
    it('should return list all banks', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      const response = await firstValueFrom(service.findAllBanks());
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockListBanks);
      expect(response).toHaveLength(2);
    });

    it('should return failed when fetch list banks', async () => {
      const err = {
        config: {},
        code: '500',
        message: 'internal server error',
      };

      const httpRequest = mockHttpRequestNest(httpService, 'get', err, true);

      try {
        const response = await firstValueFrom(service.findAll());
        expect(response).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(err);
      }

      expect(httpRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Method - captureUserBalanceValue', () => {
    it('should return balance current agency and account', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultUserBalance,
        false,
      );

      const response = await firstValueFrom(
        service.findUserBalanceValue('123123-1', '123123-2'),
      );
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockResultUserBalance);
      expect(response).toBeInstanceOf(Object);
      expect(response.data).toHaveProperty('balance');
      expect(response.data['balance']).toBe(5198.22);
    });

    it('should return failed when fetch current agency and account and not found', async () => {
      const err = {
        config: {},
        code: '500',
        message: 'internal server error',
      };

      const httpRequest = mockHttpRequestNest(httpService, 'get', err, true);

      try {
        const response = await firstValueFrom(
          service.findUserBalanceValue('123123-1', '123123-2'),
        );
        expect(response).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(err);
      }

      expect(httpRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('Method - findByEmail', () => {
    it('should return client current email when exists', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );

      const listTransactions = await firstValueFrom(service.findAll());
      const response = service.findByEmail(
        listTransactions,
        'aaronhand@ratke.name',
      );
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockListClientAwaitingReprocess[0]);
      expect(response).toBeInstanceOf(Object);
    });

    it('should return undefined when not exists', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );

      const listTransactions = await firstValueFrom(service.findAll());
      const response = service.findByEmail(
        listTransactions,
        'test_test@ratke.name',
      );
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(response).toEqual(undefined);
    });
  });

  describe('Method - setInfoBankForUser', () => {
    it('should set bank infos for user', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      const user = {
        bank: null,
        customerID: 'b1a0827c-2532-470c-954c-d93ed88590d7',
        email: '',
        key: '',
        value: 1198.22,
      };

      const listOffBanks = await firstValueFrom(service.findAllBanks());
      const userWithInfosBank = service.setInfoBankForUser(listOffBanks, user);
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(userWithInfosBank).toBeInstanceOf(Object);
      expect(userWithInfosBank).toEqual(
        expect.objectContaining({
          ...user,
          bank: expect.objectContaining({
            customerID: 'b1a0827c-2532-470c-954c-d93ed88590d7',
            agency: '5036',
            account: '98934-2',
          }),
        }),
      );
    });

    it('should return bank undefined when not found infos for user', async () => {
      const httpRequest = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      const user = {
        bank: null,
        customerID: 'b1a0827c-2532-470c-954c-d93ed8859123d3',
        email: '',
        key: '',
        value: 13498.22,
      };

      const listOffBanks = await firstValueFrom(service.findAllBanks());
      const userWithInfosBank = service.setInfoBankForUser(listOffBanks, user);
      expect(httpRequest).toHaveBeenCalledTimes(1);
      expect(userWithInfosBank).toBeInstanceOf(Object);
      expect(userWithInfosBank).toEqual(
        expect.objectContaining({
          ...user,
          bank: null,
        }),
      );
    });
  });

  describe('Method - processTransaction', () => {
    it('should return success status transaction when key is cpf and balance is available', async () => {
      const statusTransaction = await service.processTransaction(
        mockUserTransaction,
      );

      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionProcessedSuccess,
          valueTransaction: 4198.22,
          initialBalance: 5198.22,
          currentBalance: 1000,
        }),
      );
    });

    it('should return success status transaction when key is phone number and balance is available', async () => {
      const statusTransaction = await service.processTransaction({
        ...mockUserTransaction,
        key: '+5511999999999',
      });

      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionProcessedSuccess,
          valueTransaction: 4198.22,
          initialBalance: 5198.22,
          currentBalance: 1000,
        }),
      );
    });

    it('should return success status transaction when key is email and balance is available', async () => {
      const statusTransaction = await service.processTransaction({
        ...mockUserTransaction,
        key: 'test@gmail.com',
      });

      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionProcessedSuccess,
          valueTransaction: 4198.22,
          initialBalance: 5198.22,
          currentBalance: 1000,
        }),
      );
    });

    it('should return not processed status transaction when key is invalid and balance is available', async () => {
      const statusTransaction = await service.processTransaction({
        ...mockUserTransaction,
        key: 'Teste de key',
      });

      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionKeyNotValid,
          valueTransaction: 4198.22,
          initialBalance: 5198.22,
          currentBalance: 5198.22,
        }),
      );
    });

    it('should return not processed status transaction when key is valid and balance is not available', async () => {
      const statusTransaction = await service.processTransaction({
        ...mockUserTransaction,
        value: 4230198.22,
      });

      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionBalanceNotAvailable,
          valueTransaction: 4230198.22,
          initialBalance: 5198.22,
          currentBalance: 5198.22,
        }),
      );
    });
  });

  describe('Method - verifyUserBankAndProcess', () => {
    it('should return success status when user have balance and account', async () => {
      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );
      const httpRequestUserBalance = mockHttpRequestNest(
        httpService,
        'get',
        mockResultUserBalance,
        false,
      );
      const response = await firstValueFrom(service.findAllBanks());
      const statusTransaction = await service.verifyUserBankAndProcess({
        listOffBanks: response,
        user: {
          ...mockUserTransaction,
          customerID: 'b1a0827c-2532-470c-954c-d93ed88590d7',
          bank: null,
        },
      });

      expect(httpRequestListBanks).toBeCalled();
      expect(httpRequestUserBalance).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionProcessedSuccess,
          valueTransaction: 4198.22,
          initialBalance: 5198.22,
          currentBalance: 1000,
        }),
      );
    });

    it('should return error status when user dont have bank register', async () => {
      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );
      const httpRequestUserBalance = mockHttpRequestNest(
        httpService,
        'get',
        mockResultUserBalance,
        false,
      );
      const response = await firstValueFrom(service.findAllBanks());
      const statusTransaction = await service.verifyUserBankAndProcess({
        listOffBanks: response,
        user: {
          ...mockUserTransaction,
          customerID: 'teste-not-found',
          bank: null,
        },
      });

      expect(httpRequestListBanks).toBeCalled();
      expect(httpRequestUserBalance).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Object);
      expect(statusTransaction).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          status: EnumStatusTransaction.TransactionBankInfoNotFound,
          valueTransaction: 4198.22,
          currentBalance: 4198.22,
        }),
      );
    });
  });

  describe('Method - reprocessTransaction', () => {
    it('should return transaction processed success for all emails', async () => {
      const httpRequestListAllTransactions = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );
      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );
      jest.spyOn(service, 'verifyUserBankAndProcess').mockResolvedValue({
        email: '',
        status: EnumStatusTransaction.TransactionProcessedSuccess,
        valueTransaction: 4198.22,
        initialBalance: 5198.22,
        currentBalance: 1000,
      });

      const statusTransaction = await service.reprocessTransaction({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(httpRequestListAllTransactions).toBeCalled();
      expect(httpRequestListBanks).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Array);
      expect(statusTransaction).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: expect.any(String),
            status: EnumStatusTransaction.TransactionProcessedSuccess,
            valueTransaction: expect.any(Number),
            initialBalance: expect.any(Number),
            currentBalance: expect.any(Number),
          }),
        ]),
      );
    });

    it('should return transaction not found for all emails', async () => {
      const httpRequestListAllTransactions = mockHttpRequestNest(
        httpService,
        'get',
        [],
        false,
      );
      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      const statusTransaction = await service.reprocessTransaction({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(httpRequestListAllTransactions).toBeCalled();
      expect(httpRequestListBanks).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Array);
      expect(statusTransaction).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: expect.any(String),
            status: EnumStatusTransaction.TransactionNotFound,
          }),
        ]),
      );
    });

    it('should return transaction key not valid for all emails', async () => {
      const newMockListClients = mockResultListClients;

      newMockListClients.data.forEach(
        (client) => (client.key = 'teste-not-found'),
      );

      const httpRequestListAllTransactions = mockHttpRequestNest(
        httpService,
        'get',
        newMockListClients,
        false,
      );
      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );
      jest.spyOn(service, 'verifyUserBankAndProcess').mockResolvedValue({
        email: '',
        status: EnumStatusTransaction.TransactionKeyNotValid,
        valueTransaction: 4198.22,
        initialBalance: 5198.22,
        currentBalance: 5198.22,
      });

      const statusTransaction = await service.reprocessTransaction({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(httpRequestListAllTransactions).toBeCalled();
      expect(httpRequestListBanks).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Array);
      expect(statusTransaction).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: expect.any(String),
            status: EnumStatusTransaction.TransactionKeyNotValid,
            valueTransaction: 4198.22,
            initialBalance: 5198.22,
            currentBalance: 5198.22,
          }),
        ]),
      );
    });

    it('should return transaction Bank info not found for all emails', async () => {
      const httpRequestListAllTransactions = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );

      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      jest.spyOn(service, 'verifyUserBankAndProcess').mockResolvedValue({
        email: '',
        status: EnumStatusTransaction.TransactionBankInfoNotFound,
        valueTransaction: 4198.22,
        currentBalance: 5198.22,
      });

      const statusTransaction = await service.reprocessTransaction({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(httpRequestListAllTransactions).toBeCalled();
      expect(httpRequestListBanks).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Array);
      expect(statusTransaction).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: expect.any(String),
            status: EnumStatusTransaction.TransactionBankInfoNotFound,
            valueTransaction: 4198.22,
            currentBalance: 5198.22,
          }),
        ]),
      );
    });

    it('should return transaction Balance not available for all emails', async () => {
      const httpRequestListAllTransactions = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListClients,
        false,
      );

      const httpRequestListBanks = mockHttpRequestNest(
        httpService,
        'get',
        mockResultListBanks,
        false,
      );

      jest.spyOn(service, 'verifyUserBankAndProcess').mockResolvedValue({
        email: '',
        status: EnumStatusTransaction.TransactionBalanceNotAvailable,
        valueTransaction: 4198.22,
        initialBalance: 5198.22,
        currentBalance: 5198.22,
      });

      const statusTransaction = await service.reprocessTransaction({
        emails: [
          'aaronhand@ratke.name',
          'abbiehuel@thiel.net',
          'addisonratke@hermiston.biz',
          'alexandriahettinger@sanford.io',
        ],
      });

      expect(httpRequestListAllTransactions).toBeCalled();
      expect(httpRequestListBanks).toBeCalled();
      expect(statusTransaction).toBeInstanceOf(Array);
      expect(statusTransaction).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: expect.any(String),
            status: EnumStatusTransaction.TransactionBalanceNotAvailable,
            valueTransaction: 4198.22,
            initialBalance: 5198.22,
            currentBalance: 5198.22,
          }),
        ]),
      );
    });
  });
});
