
import { Controller, Get, ParseUUIDPipe } from '@nestjs/common';
import { Hiring_Data_Service } from '../services';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class Hiring_Data_Controller {

    constructor(
        private readonly Hiring_Data_Service: Hiring_Data_Service
    ) { }

    @MessagePattern('user.hiring_data.get_one')
    async get_hiring_data(@Payload(ParseUUIDPipe) _id: string) {

       return await this.Hiring_Data_Service.get_hiring_data(_id);

    }

    @MessagePattern('user.hiring_data.update')
    async update_hiring_data() {

        return 'hello';

    }

}
