export interface Itrasaction {
  customerID: string;
  email: string;
  key: string;
  value: number;
  bank: null | IuserBankInfo;
}

export interface IuserBankInfo {
  customerID: string;
  agency: string;
  account: string;
}

export interface IBankInfo {
  bank: 'Will Bank' | 'DBZ Bank';
  customers: [IuserBankInfo];
}

export interface IBalanceUser {
  balance: number;
}

export interface IverifyUserBankAndProcess {
  listOffBanks: IBankInfo[];
  user: Itrasaction;
}

export interface IProcessTransaction {
  key: string;
  value: number;
  balance: number;
  email: string;
}

export enum EnumStatusTransaction {
  TransactionProcessedSuccess = 'Transaction processed success',
  TransactionNotFound = 'Transaction not found',
  TransactionKeyNotValid = 'Transaction key not valid',
  TransactionBankInfoNotFound = 'Transaction Bank info not found',
  TransactionBalanceNotAvailable = 'Transaction Balance not available',
}
