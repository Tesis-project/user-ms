import { EntityRepository, EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';
import { Bank_Data_Ety } from "..";


@Injectable()
export class Bank_Info_Repository extends EntityRepository<Bank_Data_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, Bank_Data_Ety);
    }


    async create_bank_info(bank_info: Partial<Bank_Data_Ety>, _em?: EntityManager): Promise<Bank_Data_Ety> {

        const new_bank_info = await _em.create(Bank_Data_Ety, bank_info);
        await _em.persistAndFlush(new_bank_info);
        return new_bank_info;

    }

    async find_one(bank_info: FilterQuery<Bank_Data_Ety>, _em?: EntityManager): Promise<Bank_Data_Ety> {

        return await _em.findOne(Bank_Data_Ety, bank_info);

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


    async delete_bank_info(bank_info: Partial<Bank_Data_Ety>, _em?: EntityManager): Promise<boolean> {

        const bank_info_find = await this.find_one(bank_info, _em);

        if (!bank_info_find) {
            throw new Error('bank_info not found');
        }

        await _em.removeAndFlush(bank_info_find);
        return true;

    }

    async update_bank_info(bank_info: Partial<Bank_Data_Ety>, updateData: Partial<Bank_Data_Ety>, _em?: EntityManager): Promise<Bank_Data_Ety> {


        const bank_info_find = await this.find_one(bank_info, _em);

        if (!bank_info_find) {
            throw new Error('bank_info not found');
        }

        Object.assign(bank_info_find, updateData);
        await _em.persistAndFlush(bank_info_find);
        return bank_info_find;

    }

}
