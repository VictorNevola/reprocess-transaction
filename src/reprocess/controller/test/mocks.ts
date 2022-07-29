import { EnumStatusTransaction } from '../../service/types/transactions.type';
import { mockListClientAwaitingReprocess } from '../../service/test/mocks';

export const mockControllerFindAllSuccess = (
  status: number,
  success: boolean,
) => {
  return {
    data: success
      ? mockListClientAwaitingReprocess
      : {
          statusCode: status,
          message: 'Internal server error',
        },
    status: status,
  };
};

export const mockServiceResolvedsValues = [
  {
    email: 'luigihuels@harvey.com',
    status: EnumStatusTransaction.TransactionProcessedSuccess,
    valueTransaction: 526.53,
    initialBalance: 5000,
    currentBalance: 4473.47,
  },
  {
    email: 'lucindakreiger@jaskolski.org',
    status: EnumStatusTransaction.TransactionNotFound,
  },
  {
    email: 'wilfredmoore@mcglynn.name',
    status: EnumStatusTransaction.TransactionKeyNotValid,
    valueTransaction: 4338.09,
    initialBalance: 5000,
    currentBalance: 661.9099999999999,
  },
  {
    email: 'theodoreweimann@schneider.net',
    status: EnumStatusTransaction.TransactionBankInfoNotFound,
    valueTransaction: 4692.72,
    initialBalance: 5000,
    currentBalance: 307.27999999999975,
  },
  {
    email: 'tabithakling@labadie.org',
    status: EnumStatusTransaction.TransactionBalanceNotAvailable,
    valueTransaction: 7278.1,
    initialBalance: 5000,
    currentBalance: 5000,
  },
];
