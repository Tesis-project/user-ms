
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';
import { UpdateUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

import {
    Pagination_Dto
} from '@tesis-project/dev-globals/dist/core/dto';


@Controller()
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @MessagePattern('user.create')
    create(@Payload() createUserDto: CreateUser_Dto) {

        return this.userService.create_user(createUserDto);

    }

    @MessagePattern('user.find_all')
    findAll( @Payload() Pagination_Dto: Pagination_Dto ) {

        return this.userService.findAll(Pagination_Dto);

    }

    @MessagePattern('user.get_one')
    get_one(@Payload() _id: string) {

        return this.userService.find_one(_id);

    }

    @MessagePattern('user.update')
    update(@Payload() updateUserDto: UpdateUser_Dto) {

        return this.userService.update_user(updateUserDto._id, updateUserDto);

    }


    //   @MessagePattern('removeUser')
    //   remove(@Payload() id: number) {
    //     return this.userService.remove(id);
    //   }

}
