
import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { Bank_Info_Service } from '../services';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Update_Bank_Data_Dto, User_I_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

@Controller()
export class Bank_Info_Controller {


    constructor(private readonly Bank_Info_Service: Bank_Info_Service) { }

    @MessagePattern('user.hiring_data.bank.save')
    async save_bank_data(
        @Payload('hiring_id', ParseUUIDPipe) hiring_id: string,
        @Payload('bank') Update_Personal_Data_Dto: Update_Bank_Data_Dto,
        @Payload('user_auth') user_auth: User_I_Dto,
    ) {

        return await this.Bank_Info_Service.save_bank_data(hiring_id, user_auth, Update_Personal_Data_Dto);

    }

    @MessagePattern('user.hiring_data.bank.find_all')
    async find_all_bank_data(
        @Payload('hiring_id', ParseUUIDPipe) hiring_id: string,
        @Payload('user_auth') user_auth: User_I_Dto
    ) {

        return await this.Bank_Info_Service.find_all_bank_data(hiring_id, user_auth);

    }

    @MessagePattern('user.hiring_data.bank.delete_paymentInfo')
    async delete_paymentInfo(
        @Payload('bank_id', ParseUUIDPipe) bank_id: string,
        @Payload('user_auth') user_auth: User_I_Dto
    ) {

        return await this.Bank_Info_Service.delete_paymentInfo(bank_id, user_auth);

    }

}
