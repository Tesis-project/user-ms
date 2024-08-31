import { Global, Module } from "@nestjs/common";
import { NatsModule } from "../../../core/transports/nats.module";
import { AuthService_GW } from "./auth.service";


@Global()
@Module({
    imports: [
        NatsModule
    ],
    providers: [
        AuthService_GW
    ],
    exports: [
        AuthService_GW
    ]
})
export class AuthModule { }
