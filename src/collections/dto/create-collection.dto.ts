import { MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @MinLength(3)
  @MaxLength(30)
  title: string;
}
