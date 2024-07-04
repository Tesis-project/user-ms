
import { Cascade, Entity, EntityRepositoryType, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { Banks_Enum, Payment_Type_Enum } from '@tesis-project/dev-globals/dist/modules/user/interfaces';
import { Hiring_Data_Ety } from "./hiring-data.entity";
import { Bank_Info_Repository } from "./repository";

@Entity({
    tableName: 'user_bank_data',
    collection: 'user_bank_data',
    repository: () => Bank_Info_Repository,
})
export class Bank_Data_Ety extends Schema_key {

    [EntityRepositoryType]?: Bank_Info_Repository;

    @Enum({ items: () => Payment_Type_Enum })
    @Property()
    type: string;

    @Enum({ items: () => Banks_Enum })
    @Property()
    bank_name: string;

    @Property({
        type: 'varchar',
    })
    number: string;

    @Property({
        type: 'varchar',
    })
    titular: string;

    @Property({
        type: 'varchar',
    })
    person_id: string;

    @Property({
        type: 'varchar',
    })
    phone: string;

    @Property({
        type: 'timestamp',
        onCreate: () => new TempoHandler().date_now()
    })
    created_at = new TempoHandler().date_now()

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now();

    @ManyToOne(() => Hiring_Data_Ety, { cascade: [Cascade.ALL] })
    hiring_data: Hiring_Data_Ety;

}