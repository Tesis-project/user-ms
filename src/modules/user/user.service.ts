
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';
import { User_RepositoryService } from './entities/user.repository.service';
import { RpcException } from '@nestjs/microservices';
import { ExceptionsHandler } from '../../core/helpers';

import { CreateUser_Dto, UpdateUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';

@Injectable()
export class UserService {

    private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _User_RepositoryService: User_RepositoryService,
        private readonly em: EntityManager,
    ) {

    }

    async findAll(Pagination_Dto: Pagination_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();

            const users = await this._User_RepositoryService.find_all(f_em, Pagination_Dto);

            if (!users) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.OK,
                    message: 'Usuarios no encontrados'
                })
            }

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Usuarios encontrados',
                data: users.data,
                paginator: users.meta
            }

        } catch (error) {

            this.logger.error(`[Find all users] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.find_all');

        }

        return _Response;
    }

    async find_one(_id: string) {

        let _Response: _Response_I;

        try {

            console.log('_id', _id);

            const f_em = this.em.fork();
            const user = await this._User_RepositoryService.find_one({ _id }, f_em);

            if (!user) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no encontrado'
                })
            }

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Usuario encontrado',
                data: {
                    ...user
                }
            }

        } catch (error) {
            this.logger.error(`[Find user by id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.find_user_by_id');
        }

        return _Response;

    }

    async create_user(createUserDto: CreateUser_Dto) {

        let _Response: _Response_I;

        const {
            name,
            last_name,
            auth
        } = createUserDto;

        try {

            const f_em = this.em.fork();
            const resp_auth = await this._User_RepositoryService.find_one({ auth }, f_em);

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

    async update_user(_id: string, updateUserDto: UpdateUser_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();
            const resp_user = await this._User_RepositoryService.find_one({ _id }, f_em);

            if (!resp_user) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no encontrado'
                })
            }

            const updated_user = await this._User_RepositoryService.update_user(resp_user, updateUserDto, f_em);

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Usuario actualizado correctamente',
                data: {
                    ...updated_user
                }
            }

        } catch (error) {

            this.logger.error(`[Update user] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.update_user');

        }

        return _Response;

    }


}
