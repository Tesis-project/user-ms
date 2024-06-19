
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';


@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  create(@Payload() createUserDto: CreateUserDto) {

    return this.userService.create_user(createUserDto);
  }

  @MessagePattern('user.find_all')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('user.find_one')
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('user.update')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

//   @MessagePattern('removeUser')
//   remove(@Payload() id: number) {
//     return this.userService.remove(id);
//   }
}
