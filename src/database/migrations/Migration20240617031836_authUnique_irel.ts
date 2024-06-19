import { Migration } from '@mikro-orm/migrations';

export class Migration20240617031836_authUnique_irel extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-06-16 23:18:36\';');
    this.addSql('alter table "user" add constraint "user_auth_unique" unique ("auth");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_auth_unique";');

    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" set default \'2024-06-16 20:15:04\';');
  }

}
