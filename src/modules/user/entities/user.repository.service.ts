/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User_Ety } from './user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { Pagination_I, pagination_meta } from '@tesis-project/dev-globals/dist/core/helpers';


@Injectable()
export class User_RepositoryService extends EntityRepository<User_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em, User_Ety);
    }


    async create_user(user: Partial<User_Ety>, em?: EntityManager): Promise<User_Ety> {

        const _em = em ?? this.em;
        const new_user = await _em.create(User_Ety, user);
        await _em.persistAndFlush(new_user);
        return new_user;

    }

    async find_one(user: Partial<User_Ety>, em?: EntityManager): Promise<User_Ety> {

        const _em = em ?? this.em;
        return await _em.findOne(User_Ety, user);

    }

    async find_all(em?: EntityManager, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<User_Ety>> {

        const _em = em ?? this.em;

        if (!Pagination_Dto) {
            return {
                data: await _em.find(User_Ety, {}),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(User_Ety, {});

        // Obtener los datos paginados
        const data = await _em.find(User_Ety, {}, {
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }


    async delete_user(user: Partial<User_Ety>, em?: EntityManager): Promise<boolean> {
        const _em = em ?? this.em;
        // const user = await _em.findOne(User_Ety, { id });
        const user_find = await this.find_one(user, _em);

        if (!user_find) {
            throw new Error('User not found');
        }

        await _em.removeAndFlush(user_find);
        return true;
    }

    async update_user(user: Partial<User_Ety>, updateData: Partial<User_Ety>, em?: EntityManager): Promise<User_Ety> {

        const _em = em ?? this.em;

        const user_find = await this.find_one(user, _em);

        if (!user_find) {
            throw new Error('User not found');
        }

        Object.assign(user_find, updateData);
        await _em.persistAndFlush(user_find);
        return user_find;

    }


}
