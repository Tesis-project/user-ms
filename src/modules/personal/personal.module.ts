import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Bank_Data_Ety, Hiring_Data_Ety, Personal_Data_Ety } from './entities';
import { Bank_Info_Repository, Hiring_Data_Repository, Personal_Data_Repository } from './entities/repository';
import { Bank_Info_Controller, Hiring_Data_Controller, Personal_Data_Controller } from './controllers';
import { Bank_Info_Service, Hiring_Data_Service, Personal_Data_Service } from './services';

@Module({
    controllers: [
        Personal_Data_Controller,
        Hiring_Data_Controller,
        Bank_Info_Controller
    ],
    providers: [
        Personal_Data_Service,
        Hiring_Data_Service,
        Bank_Info_Service,
        Personal_Data_Repository,
        Hiring_Data_Repository,
        Bank_Info_Repository
    ],
    imports: [
        MikroOrmModule.forFeature([
            Hiring_Data_Ety,
            Personal_Data_Ety,
            Bank_Data_Ety
        ]),
    ]
})
export class PersonalModule { }
