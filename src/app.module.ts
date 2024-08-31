
import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/gateways/profile/profile.module';
import { PersonalModule } from './modules/personal/personal.module';
import { SearchModule } from './modules/search/search.module';
import { AuthModule } from './modules/gateways/auth/auth.module';

@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        ProfileModule,
        AuthModule,
        UserModule,
        PersonalModule,
        SearchModule,
    ],
    controllers: [],
    providers: [

    ],
})
export class AppModule { }
