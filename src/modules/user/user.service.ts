import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { _Response_I } from '../../core/interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { User_RepositoryService } from './entities/user.repository.service';
import { RpcException } from '@nestjs/microservices';
import { ExceptionsHandler } from '../../core/helpers';

@Injectable()
export class UserService {

    private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();


    constructor(
        private readonly _User_RepositoryService: User_RepositoryService,
        private readonly em: EntityManager,
    ) {

    }

    async find_user_by_auth(auth: string, em?: EntityManager) {
        return await this._User_RepositoryService.find_one({ auth }, em);
    }

    async create_user(createUserDto: CreateUserDto) {

        let _Response: _Response_I;

        const {
            name,
            last_name,
            auth
        } = createUserDto;


        try {

            const f_em = this.em.fork();
            const resp_auth = await this.find_user_by_auth(auth, f_em);

            if (resp_auth) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `El usuario ${name} ${last_name} ya existe`,
                }
                throw new RpcException(_Response)
            }

            const new_user = await this._User_RepositoryService.create_user({
                name,
                last_name,
                auth
            }, f_em);

            _Response = {
                ok: true,
                statusCode: HttpStatus.CREATED,
                message: 'Usuario creado correctamente',
                data: {
                    ...new_user
                }
            }

        } catch (error) {

            this.logger.error(`[Register user] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.create_user');


        }

        return _Response;

    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
