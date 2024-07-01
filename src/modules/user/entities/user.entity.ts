
import { Entity, Enum, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";

import { User_I } from "@tesis-project/dev-globals/dist/modules/user/interfaces";

import { TempoHandler } from "@tesis-project/dev-globals/dist/classes"

export enum Gender_Enum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    NONE = "NONE",
}

@Entity({
    tableName: 'user',
    collection: 'user'
})
export class User_Ety extends Schema_key {

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

    // profile: string;
    // hiring_data: string;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now()

}


 