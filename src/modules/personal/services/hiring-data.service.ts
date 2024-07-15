

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Hiring_Data_Repository } from '../entities/repository';


import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { RpcException } from '@nestjs/microservices';
import { ExceptionsHandler } from '../../../core/helpers';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';


@Injectable()
export class Hiring_Data_Service {

    private readonly logger = new Logger('Hiring_Data_Service');
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Hiring_Data_Repository: Hiring_Data_Repository
    ) {

    }

    async get_hiring_data(_id: string, user_auth: Auth_User_I_Dto) {

        let _Response: _Response_I;

        try {

            const hiring = await this._Hiring_Data_Repository.findOne(
                {
                    _id,
                    user: user_auth.user
                },
                {
                    populate: ['payment_accounts', 'personal'],
                }
            );

            if (!hiring) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Datos de contratación no encontrados'
                })
            }

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Datos de contratación encontrados',
                data: hiring
            }

        } catch (error) {
            this.logger.error(`[Find  Hiring data by id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'Hiring_Data_Service.get_hiring_data');
        }

        return _Response;

    }


}
