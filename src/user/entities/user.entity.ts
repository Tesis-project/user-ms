
/*  Table User {
  _id varchar [pk]
  name varchar
  last_name varchar
  gender varchar
  phone varchar
  address varchar
  city varchar
  state varchar
  auth varchar
  profile varchar
  hiring_data varchar
  updated_at timestamp
}
 */

import { Entity, Enum, Property } from "@mikro-orm/core";
import { Schema_key } from "../../core/entities_global";
import { TempoHandler } from "../../core/classes";
import { User_I } from "../../core/interfaces/model.interface";

export enum Gender_Enum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    NONE = "NONE",
}

@Entity({
    tableName: 'user',
    collection: 'user'
})
export class User extends Schema_key {

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
    gender?: string;

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
