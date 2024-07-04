
import { Controller } from '@nestjs/common';
import { Bank_Info_Service } from '../services';

@Controller()
export class Bank_Info_Controller {

    constructor(private readonly Bank_Info_Service: Bank_Info_Service) { }

}
