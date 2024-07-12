

import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { Bank_Info_Repository } from '../entities/repository';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { User_I_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

import { Update_Bank_Data_Dto, Bank_Data_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';
import { ExceptionsHandler } from '../../../core/helpers';
import * as uuid from 'uuid';

@Injectable()
export class Bank_Info_Service {

    private readonly logger = new Logger('Bank_Info_Service');

    ExceptionsHandler = new ExceptionsHandler();

    service: string = 'Bank_Info_Service';

    constructor(

        private readonly _Bank_Info_Repository: Bank_Info_Repository,
        private readonly em: EntityManager,

    ) {

    }

    async find_and_update_bank_data(hiring_id: string, user_auth: User_I_Dto, Bank_Data_Dto: Bank_Data_Dto, _em: EntityManager) {

        if (Bank_Data_Dto._id) {

            const bank_data = await this._Bank_Info_Repository.findOne(
                {
                    _id: Bank_Data_Dto._id,
                    hiring_data: {
                        _id: hiring_id,
                        user: user_auth.user
                    }
                },
                {
                    populate: ['hiring_data']
                }
            );

            if (bank_data) {

                await this._Bank_Info_Repository.update_bank_info({
                    find: bank_data,
                    update: Bank_Data_Dto,
                    _em
                })

            } else {

                const new_bank = await this._Bank_Info_Repository.create_bank_info({
                    save: {
                        ...Bank_Data_Dto,
                        hiring_data: hiring_id as any
                    },
                    _em
                });

                await _em.persist(new_bank);

            }


        } else {

            const new_bank = await this._Bank_Info_Repository.create_bank_info({
                save: {
                ...Bank_Data_Dto,
                _id: uuid.v4(),
                hiring_data: hiring_id as any
                },
                _em
            });

            await _em.persist(new_bank);

        }

    }

    async find_and_delete_if_not_exist(hiring_id: string, user_auth: User_I_Dto, payment_accounts: Bank_Data_Dto[], _em: EntityManager) {

        const bank_data = await this._Bank_Info_Repository.find(
            {
                hiring_data: {
                    _id: hiring_id,
                    user: user_auth.user
                }
            },
            {
                populate: ['hiring_data', 'hiring_data.user']
            }
        )

        for (const item of bank_data) {

            const exist = payment_accounts.find(x => x._id === item._id);

            if (!exist) {
                await this._Bank_Info_Repository.delete_bank_info({
                    find: item,
                    _em
                });
            }

        }
    }

    async delete_paymentInfo(bank_id: string, user_auth: User_I_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();

                console.log({
                     _id: bank_id,
                    hiring_data: {
                        user: user_auth.user
                    }
                })

            const bank_data = await this._Bank_Info_Repository.findOne(
                {
                    _id: bank_id,
                     hiring_data: {
                         user: user_auth.user
                     }
                },
                {
                    populate: ['hiring_data']
                }
            );

            if (bank_data) {

                await this._Bank_Info_Repository.delete_bank_info({
                    find: {
                        _id: bank_data._id
                    },
                    _em: f_em
                });

                f_em.flush();

                _Response = {
                    ok: true,
                    statusCode: 200,
                    message: 'Datos bancarios eliminados',
                    data: bank_data
                }

            } else {

                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Datos bancarios no encontrados',
                    data: null
                }

            }

        } catch (error) {

            this.logger.error(`[Delete bank data by bank id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.delete_paymentInfo`);

        }

        return _Response;

    }

    async find_all_bank_data(hiring_id: string, user_auth: User_I_Dto) {

        let _Response: _Response_I;

        try {

            const bank_data = await this._Bank_Info_Repository.find(
                {
                    hiring_data: {
                        _id: hiring_id,
                        user: user_auth.user
                    }
                },
                {
                    populate: ['hiring_data']
                }
            );

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Datos bancarios guardados',
                data: bank_data
            }

        } catch (error) {

            this.logger.error(`[ Find all bank data by hiring id ] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.find_all_bank_data`);

        }

        return _Response;

    }


    async save_bank_data(hiring_id: string, user_auth: User_I_Dto, Update_Bank_Data_Dto: Update_Bank_Data_Dto) {

        let _Response: _Response_I;

        const { payment_accounts } = Update_Bank_Data_Dto;

        try {

            const f_em = this.em.fork();
            // await this.find_and_delete_if_not_exist(hiring_id, user_auth, payment_accounts, f_em);

            for (const [i, item] of payment_accounts.entries()) {

                await this.find_and_update_bank_data(hiring_id, user_auth, item, f_em)

            }

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Datos bancarios guardados',
                data: Update_Bank_Data_Dto
            }

        } catch (error) {

            console.log('error', error);

            this.logger.error(`[Save bank data by hiring id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.save_bank_data`);

        }

        return _Response;

    }


}



