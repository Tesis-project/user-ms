

import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Bank_Info_Service {


    constructor(
        // private readonly _User_RepositoryService: User_RepositoryService,
        private readonly em: EntityManager,
    ) {

    }


}
