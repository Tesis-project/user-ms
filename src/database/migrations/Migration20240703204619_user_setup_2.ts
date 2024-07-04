import { Migration } from '@mikro-orm/migrations';

export class Migration20240703204619_user_setup_2 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_hiring_data" drop constraint "user_hiring_data_personal__id_foreign";');

    this.addSql('alter table "user_bank_data" drop constraint "user_bank_data_hiring_data__id_foreign";');

    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-07-03 16:46:19\';');

    this.addSql('alter table "user_hiring_data" drop constraint "user_hiring_data_personal__id_unique";');
    this.addSql('alter table "user_hiring_data" drop column "personal__id";');

    this.addSql('alter table "user_personal_data" add column "hiring_data__id" uuid null;');
    this.addSql('alter table "user_personal_data" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user_personal_data" alter column "updated_at" set default \'2024-07-03 16:46:19\';');
    this.addSql('alter table "user_personal_data" add constraint "user_personal_data_hiring_data__id_foreign" foreign key ("hiring_data__id") references "user_hiring_data" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_personal_data" add constraint "user_personal_data_hiring_data__id_unique" unique ("hiring_data__id");');

    this.addSql('alter table "user_bank_data" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user_bank_data" alter column "created_at" set default \'2024-07-03 16:46:19\';');
    this.addSql('alter table "user_bank_data" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user_bank_data" alter column "updated_at" set default \'2024-07-03 16:46:19\';');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" drop default;');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" type uuid using ("hiring_data__id"::text::uuid);');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" drop not null;');
    this.addSql('alter table "user_bank_data" add constraint "user_bank_data_hiring_data__id_foreign" foreign key ("hiring_data__id") references "user_hiring_data" ("_id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_personal_data" drop constraint "user_personal_data_hiring_data__id_foreign";');

    this.addSql('alter table "user_bank_data" drop constraint "user_bank_data_hiring_data__id_foreign";');

    this.addSql('alter table "user_personal_data" drop constraint "user_personal_data_hiring_data__id_unique";');
    this.addSql('alter table "user_personal_data" drop column "hiring_data__id";');

    this.addSql('alter table "user_personal_data" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user_personal_data" alter column "updated_at" set default \'2024-07-03 16:13:59\';');

    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-07-03 16:13:59\';');

    this.addSql('alter table "user_hiring_data" add column "personal__id" uuid null;');
    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_personal__id_foreign" foreign key ("personal__id") references "user_personal_data" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_hiring_data" add constraint "user_hiring_data_personal__id_unique" unique ("personal__id");');

    this.addSql('alter table "user_bank_data" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user_bank_data" alter column "created_at" set default \'2024-07-03 16:13:59\';');
    this.addSql('alter table "user_bank_data" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user_bank_data" alter column "updated_at" set default \'2024-07-03 16:13:59\';');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" drop default;');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" type uuid using ("hiring_data__id"::text::uuid);');
    this.addSql('alter table "user_bank_data" alter column "hiring_data__id" set not null;');
    this.addSql('alter table "user_bank_data" add constraint "user_bank_data_hiring_data__id_foreign" foreign key ("hiring_data__id") references "user_hiring_data" ("_id") on update cascade;');
  }

}
