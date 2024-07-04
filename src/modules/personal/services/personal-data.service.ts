

import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Personal_Data_Service {


    constructor(
        // private readonly _User_RepositoryService: User_RepositoryService,
        private readonly em: EntityManager,
    ) {

    }


}
