
import { Cascade, Entity, EntityRepositoryType, OneToMany, OneToOne, Rel } from "@mikro-orm/core";
import { Schema_key } from "../../../core/entities_global";
import { Personal_Data_Ety } from "./personal-data.entity";
import { Bank_Data_Ety } from "./bank-info.entity";
import { User_Ety } from "../../user/entities/user.entity";
import { Hiring_Data_Repository } from "./repository";


@Entity({
    tableName: 'user_hiring_data',
    collection: 'user_hiring_data',
    repository: () => Hiring_Data_Repository
})
export class Hiring_Data_Ety extends Schema_key {

    [EntityRepositoryType]?: Hiring_Data_Repository;

    @OneToOne(() => Personal_Data_Ety, personal => personal.hiring_data, { mappedBy: 'hiring_data', orphanRemoval: true })
    personal: Rel<Personal_Data_Ety>;

    @OneToMany(() => Bank_Data_Ety, bank => bank.hiring_data, { mappedBy: 'hiring_data', orphanRemoval: true})
    payment_accounts: Bank_Data_Ety[];

    @OneToOne(() => User_Ety, { cascade: [Cascade.ALL] })
    user: Rel<User_Ety>;

}