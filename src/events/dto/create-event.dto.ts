import {
  IsDateString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  collection_id: string;

  @MinLength(3)
  @MaxLength(30)
  title: string;

  @IsDateString()
  date: string;
}
