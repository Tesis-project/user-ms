import { Global, Module } from '@nestjs/common';
import { ProfileService_GW } from './profile.service';
import { NatsModule } from '../../core/transports/nats.module';

@Global()
@Module({
    imports: [
        NatsModule
    ],
    providers: [
        ProfileService_GW
    ],
    exports: [
        ProfileService_GW
    ]
})
export class ProfileModule { }
