

import { Injectable, Inject } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces"
import { Create_Profile_Dto } from "@tesis-project/dev-globals/dist/modules/profile/dto"
import { firstValueFrom } from "rxjs"
import { NATS_SERVICE } from "../../../core/config/services"
import { Auth_I } from "@tesis-project/dev-globals/dist/modules/auth/interfaces"

@Injectable()
export class AuthService_GW {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {
    }

    async get_authInfo_byId(_id: string): Promise<_Response_I<Auth_I>> {

        const resp = await firstValueFrom(
            this.client.send('auth.info_auth.user', {
                _id: _id
            })
        )
        return resp

    }

}
