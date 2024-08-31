import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { User_Repository } from '../user/entities/user.repository.service';

@Module({
  controllers: [
    SearchController
    ],
  providers: [
    SearchService,
    User_Repository
    ],

})
export class SearchModule {}
