
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';
import { User_Repository } from './entities/user.repository.service';
import { RpcException } from '@nestjs/microservices';
import { ExceptionsHandler } from '../../core/helpers';

import { CreateUser_Dto, UpdateUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';

import * as uuid from 'uuid';
import { ProfileService_GW } from '../gateways/profile/profile.service';

@Injectable()
export class UserService {

    private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _User_RepositoryService: User_Repository,
        private readonly _ProfileService_GW: ProfileService_GW,
        private readonly em: EntityManager,
    ) {

    }

    async findAll(Pagination_Dto: Pagination_Dto) {

        let _Response: _Response_I;

        try {

            const f_em = this.em.fork();

            const users = await this._User_RepositoryService.find_all({
                find: {},
                _em: f_em
            }, Pagination_Dto);

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

            const user = await this._User_RepositoryService.findOne(
                { _id },
            );

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
            const resp_auth = await this._User_RepositoryService.findOne({ auth });

            if (resp_auth) {
                _Response = {
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `El usuario ${name} ${last_name} ya existe`,
                }
                throw new RpcException(_Response)
            }

            let new_user = await this._User_RepositoryService.create_user({
                save: {
                    _id: uuid.v4(),
                    last_name,
                    name,
                    auth,
                    profile: uuid.v4(),
                    hiring_data: {
                        personal: {}
                    } as any
                },
                _em: f_em
            });

            f_em.flush();

            const new_profile = await this._ProfileService_GW.create_profile( {
                user: new_user._id
            } );

            new_user = await this._User_RepositoryService.update_user({
                find: new_user,
                update: {
                    profile: new_profile.data._id,
                },
                _em: f_em
            });

            f_em.flush();

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
            const resp_user = await this._User_RepositoryService.findOne({ _id });

            if (!resp_user) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no encontrado'
                })
            }

            const updated_user = await this._User_RepositoryService.update_user({ find: { _id }, update: updateUserDto, _em: f_em });

            f_em.flush();

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
