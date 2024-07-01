import { PartialType } from '@nestjs/mapped-types';


import { IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class Direction_Dto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class xUpdateUser_Dto {

    // @IsUUID(4)
    // _id: string;

    // @IsEnum(Gender_Enum, {
    //     message: `Status must be one of the following values: ${Gender_Enum}`
    // })
    // @IsOptional()
    // gender?: string;

    // @IsPhoneNumber()
    // @IsOptional()
    // @MinLength(6)
    // phone?: string;

    // @IsOptional()
    // @ValidateNested()
    // @Type(() => Direction_Dto)
    // direction?: Direction_Dto;

}

 