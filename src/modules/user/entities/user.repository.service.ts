/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User_Ety } from './user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

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

    async find_all(em?: EntityManager): Promise<User_Ety[]> {
        const _em = em ?? this.em;
        return await _em.find(User_Ety, {});
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
