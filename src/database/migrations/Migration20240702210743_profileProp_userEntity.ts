import { Migration } from '@mikro-orm/migrations';

export class Migration20240702210743_profileProp_userEntity extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "profile" varchar(255) not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-07-02 17:07:43\';');
    this.addSql('alter table "user" add constraint "user_profile_unique" unique ("profile");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_profile_unique";');
    this.addSql('alter table "user" drop column "profile";');

    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-06-16 23:18:36\';');
  }

}
