import { IsEmail, IsPhoneNumber, Matches } from 'class-validator';
import * as RE2 from 're2';

const regexSafetyCPF = new RE2(/^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))$/);

export class ValidateKeyEmail {
  @IsEmail()
  key: string;
}

export class ValidateKeyPhoneNumber {
  @IsPhoneNumber('PT')
  key: string;
}

export class ValidateKeyCPF {
  @Matches(regexSafetyCPF)
  key: string;
}
