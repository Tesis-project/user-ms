
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseUUIDPipe } from '@nestjs/common';

import { Hiring_Data_Service } from '../services';

import { User_I_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

@Controller()
export class Hiring_Data_Controller {

    constructor(
        private readonly Hiring_Data_Service: Hiring_Data_Service
    ) { }

    @MessagePattern('user.hiring_data.get_one')
    async get_hiring_data(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: User_I_Dto,
    ) {

        return await this.Hiring_Data_Service.get_hiring_data(_id, user_auth);

    }


}
