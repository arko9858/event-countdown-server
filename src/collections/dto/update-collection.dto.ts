import { MaxLength, MinLength } from 'class-validator';

export class UpdateCollectionDto {
  @MinLength(3)
  @MaxLength(30)
  title: string;
}
