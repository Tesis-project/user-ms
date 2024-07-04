

import { EntityRepository, EntityManager, FilterQuery } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Pagination_I, pagination_meta } from "@tesis-project/dev-globals/dist/core/helpers";

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';
import { Personal_Data_Ety } from "..";


@Injectable()
export class Personal_Data_Repository extends EntityRepository<Personal_Data_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, Personal_Data_Ety);
    }

    async create_personal_data(personal_data: Partial<Personal_Data_Ety>, em?: EntityManager): Promise<Personal_Data_Ety> {

        const _em = em ?? this.em;
        const new_personal_data = await _em.create(Personal_Data_Ety, personal_data);
        await _em.persistAndFlush(new_personal_data);
        return new_personal_data;

    }

    async find_one(personal_data: FilterQuery<Personal_Data_Ety>, em?: EntityManager): Promise<Personal_Data_Ety> {

        const _em = em ?? this.em;
        return await _em.findOne(Personal_Data_Ety, personal_data);

    }

    async find_all(em?: EntityManager, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Personal_Data_Ety>> {

        const _em = em ?? this.em;

        if (!Pagination_Dto) {
            return {
                data: await _em.find(Personal_Data_Ety, {}),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Personal_Data_Ety, {});

        const data = await _em.find(Personal_Data_Ety, {}, {
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_personal_data(personal_data: Partial<Personal_Data_Ety>, em?: EntityManager): Promise<boolean> {

        const _em = em ?? this.em;
        const personal_data_find = await this.find_one(personal_data, _em);

        if (!personal_data_find) {
            throw new Error('personal_data not found');
        }

        await _em.removeAndFlush(personal_data_find);
        return true;

    }

    async update_personal_data(personal_data: Partial<Personal_Data_Ety>, updateData: Partial<Personal_Data_Ety>, em?: EntityManager): Promise<Personal_Data_Ety> {

        const _em = em ?? this.em;

        const personal_data_find = await this.find_one(personal_data, _em);

        if (!personal_data_find) {
            throw new Error('personal_data not found');
        }

        Object.assign(personal_data_find, updateData);
        await _em.persistAndFlush(personal_data_find);
        return personal_data_find;

    }

}
