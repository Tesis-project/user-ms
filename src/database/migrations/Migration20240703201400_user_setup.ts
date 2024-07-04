import { Migration } from '@mikro-orm/migrations';

export class Migration20240703201400_user_setup extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "user_personal_data" ("_id" uuid not null default gen_random_uuid(), "address" varchar(255) null default \'\', "city" varchar(255) null default \'\', "phone" varchar(255) null default \'\', "postal_code" varchar(255) null default \'\', "rif" varchar(255) null default \'\', "social_reason" varchar(255) null default \'\', "state" varchar(255) null default \'\', "updated_at" timestamptz not null default \'2024-07-03 16:13:59\', constraint "user_personal_data_pkey" primary key ("_id"));');

    this.addSql('create table "user" ("_id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "last_name" varchar(255) not null, "gender" text check ("gender" in (\'MALE\', \'FEMALE\', \'NONE\')) not null default \'NONE\', "phone" varchar(255) null, "direction" jsonb null, "auth" varchar(255) not null, "profile" varchar(255) not null, "updated_at" timestamptz not null default \'2024-07-03 16:13:59\', constraint "user_pkey" primary key ("_id"));');
    this.addSql('alter table "user" add constraint "user_auth_unique" unique ("auth");');
    this.addSql('alter table "user" add constraint "user_profile_unique" unique ("profile");');

    this.addSql('create table "user_hiring_data" ("_id" uuid not null default gen_random_uuid(), "personal__id" uuid null, "user__id" uuid null, constraint "user_hiring_data_pkey" primary key ("_id"));');
    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_personal__id_unique" unique ("personal__id");');
    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_user__id_unique" unique ("user__id");');

    this.addSql('create table "user_bank_data" ("_id" uuid not null default gen_random_uuid(), "type" text check ("type" in (\'BANK_ACCOUNT\', \'MOBILE_PAYMENT\')) not null, "bank_name" text check ("bank_name" in (\'BC_BICENTENARIO\', \'BC_BANESCO\', \'BC_TESORO\', \'BC_PROVINCIAL\', \'BC_MERCANTIL\', \'BC_VENEZUELA\')) not null, "number" varchar(255) not null, "titular" varchar(255) not null, "person_id" varchar(255) not null, "phone" varchar(255) not null, "created_at" timestamptz not null default \'2024-07-03 16:13:59\', "updated_at" timestamptz not null default \'2024-07-03 16:13:59\', "hiring_data__id" uuid not null, constraint "user_bank_data_pkey" primary key ("_id"));');

    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_personal__id_foreign" foreign key ("personal__id") references "user_personal_data" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "user_bank_data" add constraint "user_bank_data_hiring_data__id_foreign" foreign key ("hiring_data__id") references "user_hiring_data" ("_id") on update cascade;');

  }

  async down(): Promise<void> {
    this.addSql('alter table "user_hiring_data" drop constraint "user_hiring_data_personal__id_foreign";');

    this.addSql('alter table "user_hiring_data" drop constraint "user_hiring_data_user__id_foreign";');

    this.addSql('alter table "user_bank_data" drop constraint "user_bank_data_hiring_data__id_foreign";');






    this.addSql('drop table if exists "user_personal_data" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "user_hiring_data" cascade;');

    this.addSql('drop table if exists "user_bank_data" cascade;');
  }

}
