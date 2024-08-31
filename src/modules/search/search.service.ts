
import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Pagination_Dto } from "@tesis-project/dev-globals/dist/core/dto";
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { SearchUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';
import { ProfileService_GW } from '../gateways/profile/profile.service';
import { User_Repository } from '../user/entities/user.repository.service';
import { ExceptionsHandler } from '../../core/helpers';
import { User_Ety } from '../user/entities/user.entity';
import { AuthService_GW } from '../gateways/auth/auth.service';
import { User_Role_Enum } from '@tesis-project/dev-globals/dist/modules/auth/interfaces';
import { userArtist_Type } from '@tesis-project/dev-globals/dist/modules/profile/interfaces';

@Injectable()
export class SearchService {

    private readonly logger = new Logger('SearchService');
    ExceptionsHandler = new ExceptionsHandler();

    constructor(
        private readonly _User_RepositoryService: User_Repository,
        private readonly _ProfileService_GW: ProfileService_GW,
        private readonly _AuthService_GW: AuthService_GW,
        private readonly em: EntityManager,
    ) {

    }

    users_notFound(users: User_Ety[]) {

        if (!users || users.length === 0) {
            throw new RpcException({
                ok: false,
                data: null,
                statusCode: HttpStatus.OK,
                message: 'Usuarios no encontrados'
            })
        }

    }

    async filter_byRole(users: User_Ety[]): Promise<User_Ety[]> {

        const aux_users: User_Ety[] = [];

        if (!users || users.length === 0) return aux_users;

        for (const [i, item] of users.entries()) {

            let resp = await this._AuthService_GW.get_authInfo_byId(item.auth);
            if (resp.ok) {

                const data = resp.data;
                if (data.role === User_Role_Enum.ARTIST_ROLE) {
                    aux_users.push(item);
                }

            }

        }

        return aux_users;

    }

    async filter_bySkills(users: User_Ety[], skill: userArtist_Type): Promise<User_Ety[]> {

        const aux_users: User_Ety[] = [];

        if (!users || users.length === 0) return aux_users;

        for (const [i, item] of users.entries()) {

            let resp = await this._ProfileService_GW.get_artist_identify(item.profile);

            if (resp.ok) {

                const data = resp.data;
                if (data.includes(skill) || skill === 'all') {

                    aux_users.push({
                        ...item,
                    });

                }

            }
        }

        return aux_users;
    }

    async filter_byTerm(users: User_Ety[], term: string): Promise<User_Ety[]> {

        const aux_users: User_Ety[] = [];

        if (!users || users.length === 0) return aux_users;

        for (const [i, item] of users.entries()) {

            const user = JSON.stringify(item);
            if (user.includes(term)) {
                aux_users.push(item);
            }

        }

        return aux_users;

    }

    async add_profile(users: User_Ety[]): Promise<User_Ety[]> {

        const aux_users: User_Ety[] = [];

        if (!users || users.length === 0) return aux_users;

        for (const [i, item] of users.entries()) {

            let resp = await this._ProfileService_GW.get_profile_byId(item.profile);

            if (resp.ok) {

                const data = resp.data;
                aux_users.push({
                    ...item,
                    profile: data
                });

            }

        }

        return aux_users;
    }

    async findAll(SearchUser_Dto: SearchUser_Dto, Pagination_Dto: Pagination_Dto) {

        let _Response: _Response_I;

        const typeSkill: userArtist_Type = SearchUser_Dto.type || 'all';

        try {

            let users = await this._User_RepositoryService.findAll();

            users = await this.filter_byRole(users);
            users = await this.filter_bySkills(users, typeSkill);
            users = await this.add_profile(users);

            await this.users_notFound(users);

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Usuarios encontrados',
                data: users,
            }

        } catch (error) {

            this.logger.error(`[Search Find all users] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'SearchService.findAll');

        }

        return _Response;
    }

    async findByTerm(SearchUser_Dto: SearchUser_Dto, Pagination_Dto: Pagination_Dto) {

        let _Response: _Response_I;

        const term: string = SearchUser_Dto.term || '';

        console.log('term', term);

        try {

            let users = await this._User_RepositoryService.findAll();

            users = await this.filter_byRole(users);
            users = await this.add_profile(users);
            users = await this.filter_byTerm(users, term);

            await this.users_notFound(users);

            _Response = {
                ok: true,
                statusCode: HttpStatus.OK,
                message: 'Usuarios encontrados',
                data: users,
            }

        } catch (error) {

            this.logger.error(`[Search Find all users by term] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, 'SearchService.findByTerm');

        }

        return _Response;
    }

}
