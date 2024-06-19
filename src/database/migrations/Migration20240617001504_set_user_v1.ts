import { Migration } from '@mikro-orm/migrations';

export class Migration20240617001504_set_user_v1 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("_id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "last_name" varchar(255) not null, "gender" text check ("gender" in (\'MALE\', \'FEMALE\', \'NONE\')) not null, "phone" varchar(255) null, "direction" jsonb null, "auth" varchar(255) not null, "updated_at" timestamptz not null default \'2024-06-16 20:15:04\', constraint "user_pkey" primary key ("_id"));');


  }

  async down(): Promise<void> {

    this.addSql('drop table if exists "user" cascade;');
  }

}
