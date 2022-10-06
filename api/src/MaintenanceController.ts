import { Controller, Get, Query } from '@nestjs/common';
import { LanguageId } from 'src/models/Language';
import { WordService } from 'src/services/WordService';

@Controller('/maintenance')
export class MaintenanceController {
    constructor(private wordService: WordService) {}

    @Get('/reindex')
    async reindex(@Query('language_id') languageId: LanguageId) {
        await this.wordService.reindex(languageId);

        return 'ok';
    }
}
