import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';
import { MaintenanceService } from 'services/MaintenanceService';
import { chain } from 'stream-chain';
import { parser as jsonParser } from 'stream-json/jsonl/Parser';
import { stringer as jsonStringer } from 'stream-json/jsonl/Stringer';
import { DATE_FORMAT } from 'utils/constants';

@Controller('/api/tools')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get('/export')
  export(): StreamableFile {
    const jsonStream = chain([
      this.maintenanceService.export(),
      jsonStringer(),
    ]);
    const fileName = `mova-db:${DateTime.utc().toFormat(DATE_FORMAT)}.jsonl`;

    return new StreamableFile(jsonStream, {
      type: 'application/json',
      disposition: `attachment; filename="${fileName}"`,
    });
  }

  @Post('/import')
  async import(@Req() req: FastifyRequest) {
    const multipartFile = await req.file();
    const recordStream = chain([multipartFile.file, jsonParser()]);

    await this.maintenanceService.import(recordStream);
  }

  @Delete('/destroy')
  async destroy() {
    await this.maintenanceService.destroy();
  }

  @Put('/reindex')
  async reindexLanguage(@Query('id') languageId: LanguageId) {
    const language = await this.maintenanceService.reindexLanguage(languageId);
    return language;
  }

  @Put('/resync/progress')
  async resyncProgress(@Query('id') languageId: LanguageId) {
    const language = await this.maintenanceService.resyncProgress(languageId);
    return language;
  }
}
