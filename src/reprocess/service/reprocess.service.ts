import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { validate } from 'class-validator';
import { lastValueFrom, map, Observable } from 'rxjs';
import * as RE2 from 're2';

import { ReprocessDto } from '../dto/update-reprocess.dto';
import {
  ValidateKeyEmail,
  ValidateKeyPhoneNumber,
  ValidateKeyCPF,
} from '../dto/validate-key.dto';
import {
  IBalanceUser,
  IBankInfo,
  IverifyUserBankAndProcess,
  Itrasaction,
  EnumStatusTransaction,
  IProcessTransaction,
} from './types/transactions.type';

@Injectable()
export class ReprocessService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findAll(): Observable<Itrasaction[]> {
    return this.httpService
      .get(
        this.configService.getOrThrow<string>(
          'URL_TRANSACTIONS_AWAITING_REPROCESSING',
        ),
      )
      .pipe(map((response) => response.data));
  }

  findAllBanks(): Observable<IBankInfo[]> {
    return this.httpService
      .get(this.configService.getOrThrow('URL_BANK_CLIENTS'))
      .pipe(map((response) => response.data));
  }

  findUserBalanceValue(agency: string, account: string) {
    return this.httpService.get(
      this.configService.getOrThrow('URL_CLIENT_BALANCE'),
      {
        params: {
          agency,
          account,
        },
      },
    );
  }

  findByEmail(listOfTransactions: Itrasaction[], email: string) {
    return listOfTransactions?.find((user) => user.email === email);
  }

  setInfoBankForUser(listOffBanks: IBankInfo[], user: Itrasaction) {
    const allBaseBank = [...listOffBanks.map((bank) => bank.customers).flat()];
    user.bank =
      allBaseBank.find((info) => info.customerID === user.customerID) || null;

    return user;
  }

  async processTransaction(params: IProcessTransaction) {
    const { key, balance, email, value } = params;

    const regexSafety = new RE2(/[^0-9]/g);
    const validateKeyEmail = new ValidateKeyEmail();
    const validateKeyPhoneNumber = new ValidateKeyPhoneNumber();
    const validateKeyCPF = new ValidateKeyCPF();

    validateKeyEmail.key = key;
    validateKeyCPF.key = key;
    validateKeyPhoneNumber.key = `+${key.replace(regexSafety, '')}`;

    const [keyIsEmail, keyIsPhoneNumber, keyIsCPF] = await Promise.all([
      validate(validateKeyEmail).then((errors) => errors.length === 0),
      validate(validateKeyPhoneNumber).then((errors) => errors.length === 0),
      validate(validateKeyCPF).then((errors) => errors.length === 0),
    ]);

    let currentBalance = balance;
    let status =
      balance >= value
        ? EnumStatusTransaction.TransactionKeyNotValid
        : EnumStatusTransaction.TransactionBalanceNotAvailable;

    if (balance >= value && (keyIsEmail || keyIsPhoneNumber || keyIsCPF)) {
      currentBalance = balance - value;
      status = EnumStatusTransaction.TransactionProcessedSuccess;
    }

    return {
      email,
      status,
      valueTransaction: value,
      initialBalance: balance,
      currentBalance,
    };
  }

  async verifyUserBankAndProcess({
    listOffBanks,
    user,
  }: IverifyUserBankAndProcess) {
    const userWithBank = this.setInfoBankForUser(listOffBanks, user);

    if (userWithBank.bank !== null) {
      const {
        bank: { agency, account },
        value,
        key,
      } = userWithBank;
      const userBalance: AxiosResponse<IBalanceUser> = await lastValueFrom(
        this.findUserBalanceValue(agency, account),
      );

      return this.processTransaction({
        key,
        value,
        balance: userBalance.data.balance,
        email: user.email,
      });
    }

    return {
      email: user.email,
      status: EnumStatusTransaction.TransactionBankInfoNotFound,
      valueTransaction: user.value,
      currentBalance: user.value,
    };
  }

  async reprocessTransaction(reprocessDto: ReprocessDto) {
    const { emails } = reprocessDto;

    const [listOfTransactions, listOffBanks] = await Promise.all([
      lastValueFrom(this.findAll()),
      lastValueFrom(this.findAllBanks()),
    ]);

    const usersTransactionsStatus = await Promise.all(
      emails.map(async (email) => {
        const user = this.findByEmail(listOfTransactions, email);

        if (user) {
          return this.verifyUserBankAndProcess({
            listOffBanks,
            user,
          });
        }

        return {
          email,
          status: EnumStatusTransaction.TransactionNotFound,
        };
      }),
    );

    return usersTransactionsStatus;
  }
}
