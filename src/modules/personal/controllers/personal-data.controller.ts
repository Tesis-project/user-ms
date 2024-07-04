
import { Controller } from '@nestjs/common';
import { Personal_Data_Service } from '../services';

@Controller()
export class Personal_Data_Controller {

    constructor(private readonly Personal_Data_Service: Personal_Data_Service) { }

}
