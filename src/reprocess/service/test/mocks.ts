import { Observable } from 'rxjs';

export const mockListClientAwaitingReprocess = [
  {
    customerID: 'b1a0827c-2532-470c-954c-d93ed88590d7',
    email: 'aaronhand@ratke.name',
    key: '976.565.843-06',
    value: 4731.29,
    bank: null,
  },
  {
    customerID: '4972f2a7-77cf-4cb6-a76f-c730b683ec98',
    email: 'abbiehuel@thiel.net',
    key: '+55 41 13036-6576',
    value: 816.7,
    bank: null,
  },
  {
    customerID: 'b38c8b80-eecc-4d24-9092-5786a8d0a93f',
    email: 'addisonratke@hermiston.biz',
    key: '393.090.703-76',
    value: 5198.22,
    bank: null,
  },
  {
    customerID: '87d8ce22-d8bf-42b1-8d91-2b1a3de8e66d',
    email: 'alexandriahettinger@sanford.io',
    key: 'alexandriahettinger@sanford.io',
    value: 54.92,
    bank: null,
  },
];

export const mockListBanks = [
  {
    bank: 'Will Bank',
    customers: [
      {
        customerID: 'b1a0827c-2532-470c-954c-d93ed88590d7',
        agency: '5036',
        account: '98934-2',
      },
      {
        customerID: '4972f2a7-77cf-4cb6-a76f-c730b683ec98',
        agency: '0154',
        account: '58724-0',
      },
      {
        customerID: 'c3d4abd2-c301-45c9-950a-b023464e035c',
        agency: '3670',
        account: '06495-1',
      },
    ],
  },
  {
    bank: 'DBZ Bank',
    customers: [
      {
        customerID: 'b38c8b80-eecc-4d24-9092-5786a8d0a93f',
        agency: '3838',
        account: '21183-9',
      },
      {
        customerID: '87d8ce22-d8bf-42b1-8d91-2b1a3de8e66d',
        agency: '5129',
        account: '39493-1',
      },
    ],
  },
];

export const mockUserBalance = {
  balance: 5198.22,
};

export const mockResultListClients = {
  data: mockListClientAwaitingReprocess,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockResultListBanks = {
  data: mockListBanks,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockResultUserBalance = {
  data: mockUserBalance,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockUserTransaction = {
  balance: 5198.22,
  email: 'test@gmail.com',
  key: '999.999.999-99',
  value: 4198.22,
};

export const mockHttpRequestNest = (
  instance: any,
  method: string,
  result: any,
  error: boolean,
) => {
  return jest.spyOn(instance, method).mockImplementationOnce(() => {
    return new Observable((s) => {
      if (error) {
        s.error(result);
      } else {
        s.next(result);
        s.complete();
      }
    });
  });
};
