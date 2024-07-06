
import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { Personal_Data_Service } from '../services';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Update_Personal_Data_Dto, User_I_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

@Controller()
export class Personal_Data_Controller {


    constructor(private readonly Personal_Data_Service: Personal_Data_Service) { }

    @MessagePattern('user.hiring_data.personal.save')
    async get_one(
        @Payload('hiring_id', ParseUUIDPipe) hiring_id: string,
        @Payload('personal') Update_Personal_Data_Dto: Update_Personal_Data_Dto,
        @Payload('user_auth') user: User_I_Dto,
    ) {

        return await this.Personal_Data_Service.save_personal(hiring_id, user, Update_Personal_Data_Dto);

    }

}
