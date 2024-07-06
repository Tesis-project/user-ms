import { Cascade, Entity, EntityRepositoryType, OneToOne, Property } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { TempoHandler } from "@tesis-project/dev-globals/dist/core/classes";
import { Hiring_Data_Ety } from "./hiring-data.entity";
import { Hiring_Data_Repository, Personal_Data_Repository } from "./repository";


@Entity({
    tableName: 'user_personal_data',
    collection: 'user_personal_data',
    repository: () => Personal_Data_Repository,
})
export class Personal_Data_Ety extends Schema_key {

    [EntityRepositoryType]?: Personal_Data_Repository;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    address?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    city?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    phone?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    postal_code?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    rif?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    social_reason?: string;

    @Property({
        type: 'varchar',
        nullable: true,
        default: ''
    })
    state?: string;

    @Property({
        type: 'timestamp',
        onUpdate: () => new TempoHandler().date_now()
    })
    updated_at = new TempoHandler().date_now();

    @OneToOne(() => Hiring_Data_Ety,  { cascade: [Cascade.ALL], orphanRemoval: true })
    hiring_data: Hiring_Data_Ety;

}