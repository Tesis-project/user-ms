

import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';

import { Personal_Data_Repository } from '../entities/repository';
import { ExceptionsHandler } from '../../../core/helpers';
import { RpcException } from '@nestjs/microservices';
import { Update_Personal_Data_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';

@Injectable()
export class Personal_Data_Service {


    private readonly logger = new Logger('Personal_Data_Service');
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _Personal_Data_Repository: Personal_Data_Repository,
        private readonly em: EntityManager,
    ) {

    }

    async save_personal(_hiring_id: string, user: Auth_User_I_Dto, personal: Update_Personal_Data_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();
            const personal_data = await this._Personal_Data_Repository.findOne(
                {
                    hiring_data: {
                        _id: _hiring_id,
                        user: user.user
                    }
                },
                {
                    populate: ['hiring_data'],
                },
            );

            if (!personal_data) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Información personal no encontrada'
                })
            }

            const personal_data_update = await this._Personal_Data_Repository.update_personal_data({
                find: personal_data,
                update: personal,
                _em: f_em
            })

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Datos personales guardados',
                data: personal_data_update,
            }

        } catch (error) {

            this.logger.error(`[Save personal] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'Personal_Data_Service.save_personal');

        }

        return _Response;

    }


}
