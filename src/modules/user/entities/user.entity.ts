
import { Cascade, Entity, EntityRepositoryType, Enum, OneToOne, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";

import { Gender_Enum, User_I } from "@tesis-project/dev-globals/dist/modules/user/interfaces";

import { Hiring_Data_Ety } from "../../personal/entities";
import { User_Repository } from "./user.repository.service";
import { TempoHandler } from '@tesis-project/dev-globals/dist/core/classes';


@Entity({
    tableName: 'user',
    collection: 'user',
    repository: () => User_Repository
})
export class User_Ety extends Schema_key {

    [EntityRepositoryType]?: User_Repository;

    @Property({
        type: 'varchar'
    })
    name: string;

    @Property({
        type: 'varchar'
    })
    last_name: string;

    @Enum({ items: () => Gender_Enum })
    @Property({
        nullable: true
    })
    gender?: string = "NONE";

    @Property({
        type: 'varchar',
        nullable: true
    })
    phone?: string;

    @Property({
        type: 'jsonb',
        nullable: true
    })
    direction?: User_I['direction'];

    @Property({
        type: 'varchar',
        unique: true
    })
    auth: any;

    @Property({
        type: 'varchar',
        unique: true
    })
    profile: any;

    // @OneToOne(() => Hiring_Data_Ety, { inversedBy: 'user', orphanRemoval: true })
    @OneToOne(() => Hiring_Data_Ety, hiring => hiring.user, { mappedBy: 'user', orphanRemoval: true })
    hiring_data: Hiring_Data_Ety;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now()

}

