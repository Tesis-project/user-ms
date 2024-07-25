import { Migration } from '@mikro-orm/migrations';

export class Migration20240723192837_specific_conditions extends Migration {

    async up(): Promise<void> {

        this.addSql('alter table "user_personal_data" add column "specific_conditions" varchar(255) null default \'\';');

    }

    async down(): Promise<void> {

        this.addSql('alter table "user_personal_data" drop column "specific_conditions";');

    }

}
