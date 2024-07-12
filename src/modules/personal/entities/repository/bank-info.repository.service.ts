import { EntityRepository, EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';
import { Bank_Data_Ety } from "..";
import { _Find_One_I, _Process_Delete_I, _Process_Save_I, _Process_Update_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { MikroORM } from "@mikro-orm/postgresql";


@Injectable()
export class Bank_Info_Repository extends EntityRepository<Bank_Data_Ety> {

    constructor(
        em: EntityManager,
        private readonly orm: MikroORM

    ) {
        // super(em, Bank_Data_Ety);
        super(em.fork(), Bank_Data_Ety);

    }

    async create_bank_info({ save, _em }: _Process_Save_I<Bank_Data_Ety>): Promise<Bank_Data_Ety> {

        const new_bank_info = await _em.create(Bank_Data_Ety, save);
        await _em.persist(new_bank_info);
        return new_bank_info;

    }

    async find_one({ find, _em }: _Find_One_I<Bank_Data_Ety, 'Bank_Data_Ety'>): Promise<Bank_Data_Ety> {

        return await _em.findOne(Bank_Data_Ety, find);

    }

    async find_all(_em?: EntityManager, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Bank_Data_Ety>> {


        if (!Pagination_Dto) {
            return {
                data: await _em.find(Bank_Data_Ety, {}),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Bank_Data_Ety, {});

        const data = await _em.find(Bank_Data_Ety, {}, {
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_bank_info({ find,  _em}: _Process_Delete_I<Bank_Data_Ety>): Promise<boolean> {

        const bank_info_find = await this.findOne(find);

        if (!bank_info_find) {
            throw new Error('bank_info not found');
        }

        const l = await _em.nativeDelete(Bank_Data_Ety, {
            _id: bank_info_find._id
        });
        return true;

    }

    async update_bank_info({ find, update, _em}: _Process_Update_I<Bank_Data_Ety>): Promise<Bank_Data_Ety> {

        const bank_info_find = await this.find_one({ find, _em});

        if (!bank_info_find) {
            throw new Error('bank_info not found');
        }

        Object.assign(bank_info_find, update);
        await _em.persist(bank_info_find);
        return bank_info_find;

    }

}
