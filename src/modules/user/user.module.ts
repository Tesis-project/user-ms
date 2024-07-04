
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User_Ety } from './entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User_Repository } from './entities/user.repository.service';
import { NatsModule } from '../../core/transports/nats.module';

@Module({
    controllers: [UserController],
    providers: [UserService, User_Repository],
    imports: [
        MikroOrmModule.forFeature([
            User_Ety
        ]),
        NatsModule
    ]
})
export class UserModule {  }
