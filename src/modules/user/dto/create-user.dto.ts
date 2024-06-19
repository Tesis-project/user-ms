import { IsString, IsUUID } from "class-validator";

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    last_name: string;

    @IsString()
    @IsUUID(4)
    auth: string;

}
