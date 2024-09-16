
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
import { Profile_I } from '@tesis-project/dev-globals/dist/modules/profile/interfaces';
import { User_Ety } from './entities/user.entity';
import { Auth_I } from '@tesis-project/dev-globals/dist/modules/auth/interfaces';
import { AuthService_GW } from '../gateways/auth/auth.service';

@Injectable()
export class UserService {

    private readonly logger = new Logger('UserService');

    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _User_RepositoryService: User_Repository,
        private readonly _ProfileService_GW: ProfileService_GW,
        private readonly _AuthService_GW: AuthService_GW,
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


    async set_profile( profile_id: string): Promise<_Response_I<Profile_I>> {

        let _Response: _Response_I;

        try {

             let resp = await this._ProfileService_GW.get_profile_byId(profile_id);

                const data = resp.data;

                _Response = {
                    ok: true,
                    statusCode: HttpStatus.OK,
                    message: 'Perfil encontrado',
                    data: data
                }


        } catch (error) {

            this.logger.error(`[Set profile] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.set_profile');

        }

        return _Response;

    }

    async set_oneAuth( auth_id: string): Promise<_Response_I<Partial<Auth_I>>> {

        let _Response: _Response_I;

        try {

             let resp = await this._AuthService_GW.get_authInfo_byId(auth_id);

                let data = resp.data;

                let aux_data: Partial<Auth_I> = {
                    _id: data._id,
                    email: data.email,
                    username: data.username,
                    role: data.role,
                    last_session: data.last_session,
                    status: data.status,
                    created_at: data.created_at,
                }

                _Response = {
                    ok: true,
                    statusCode: HttpStatus.OK,
                    message: 'Auth encontrado',
                    data: {
                        ...aux_data
                    }
                }


        } catch (error) {

            this.logger.error(`[Set auth] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.set_oneAuth');

        }

        return _Response;

    }

    async find_oneProfile(_id: string){
         let _Response: _Response_I;

        try {

            let user = await this._User_RepositoryService.findOne(
                { _id },
                {
                    populate: ['hiring_data', 'hiring_data.personal', 'hiring_data.payment_accounts']
                }
            );

            if (!user) {
                throw new RpcException({
                    ok: false,
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Usuario no encontrado'
                })
            }

            const profile = await this.set_profile(user.profile);
            const auth = await this.set_oneAuth(user.auth);

            user = {
                ...user,
                profile: profile.data,
                auth: {
                    ...auth.data,
                    password: '********'
                } as Auth_I
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
            this.logger.error(`[Find profile user by id] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'UserService.find_oneProfile');
        }

        return _Response;
    }

    async find_one(_id: string) {

        let _Response: _Response_I;

        try {

            let user = await this._User_RepositoryService.findOne(
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

            const new_profile = await this._ProfileService_GW.create_profile({
                user: new_user._id
            });

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
