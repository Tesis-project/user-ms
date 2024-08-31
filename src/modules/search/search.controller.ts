

import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Pagination_Dto } from "@tesis-project/dev-globals/dist/core/dto";
import { SearchUser_Dto } from '@tesis-project/dev-globals/dist/modules/user/dto';

@Controller()
export class SearchController {

    constructor(
        private readonly searchService: SearchService
    ) { }

    @MessagePattern('user.search.byType')
    findAll(
        @Payload('search') SearchUser_Dto: SearchUser_Dto,
        @Payload('pagination') paginationDto: Pagination_Dto
    ) {

        return this.searchService.findAll(SearchUser_Dto, paginationDto);

    }

    @MessagePattern('user.search.byTerm')
    findByTerm(
        @Payload('search') SearchUser_Dto: SearchUser_Dto,
        @Payload('pagination') paginationDto: Pagination_Dto
    ) {

        return this.searchService.findByTerm(SearchUser_Dto, paginationDto);

    }

}
