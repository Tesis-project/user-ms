

import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { Personal_Data_Ety } from "..";
import { _Find_One_I, _Process_Save_I, _Process_Delete_I, _Process_Update_I } from '@tesis-project/dev-globals/dist/core/interfaces';


@Injectable()
export class Personal_Data_Repository extends EntityRepository<Personal_Data_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Personal_Data_Ety);
    }


    async update_personal_data({ find, update, _em }: _Process_Update_I<Personal_Data_Ety>): Promise<Personal_Data_Ety> {

        const personal_data_find = await this.findOne( find );

        if (!personal_data_find) {
            throw new Error('personal_data not found');
        }

        Object.assign(personal_data_find, update);
        await _em.persist(personal_data_find);
        return personal_data_find;

    }

}
