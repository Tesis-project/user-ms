

import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { Hiring_Data_Ety } from "..";

import { _Find_One_I, _Process_Update_I } from '@tesis-project/dev-globals/dist/core/interfaces';


@Injectable()
export class Hiring_Data_Repository extends EntityRepository<Hiring_Data_Ety> {

    constructor(
        em: EntityManager,
    ) {
        super(em, Hiring_Data_Ety);
    }

    async find_one({ find, options, _em }: _Find_One_I<Hiring_Data_Ety, 'Hiring_Data_Ety'>): Promise<Hiring_Data_Ety> {

        return await _em.findOne(Hiring_Data_Ety, find, options);

    }

    async update_hiring_data({ find, update, _em }: _Process_Update_I): Promise<Hiring_Data_Ety> {

        const hiring_data_find = await this.find_one({ find, _em});

        if (!hiring_data_find) {
            throw new Error('hiring_data not found');
        }

        Object.assign(hiring_data_find, update);
        await _em.persistAndFlush(hiring_data_find);
        return hiring_data_find;

    }

}
