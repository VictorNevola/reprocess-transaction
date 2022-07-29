import { IsEmail } from 'class-validator';

export class ReprocessDto {
  @IsEmail(
    {},
    {
      each: true,
    },
  )
  emails: string[];
}
