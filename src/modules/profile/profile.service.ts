import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '../../core/config/services';
import { Create_Profile_Dto } from '@tesis-project/dev-globals/dist/modules/profile/dto';
import { _Response_I, Profile_I } from '@tesis-project/dev-globals/dist/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProfileService_GW {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {

    }

    async create_profile(profile: Create_Profile_Dto): Promise<_Response_I<Profile_I>> {

        const resp = await firstValueFrom(
            this.client.send('profile.create', profile)
        )
        return resp

    }

}
