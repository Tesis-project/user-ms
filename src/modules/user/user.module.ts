
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User_Ety } from './entities/user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User_RepositoryService } from './entities/user.repository.service';

@Module({
    controllers: [UserController],
    providers: [UserService, User_RepositoryService],
    imports: [
        MikroOrmModule.forFeature([
            User_Ety
        ]),
    ]
})
export class UserModule {  }
