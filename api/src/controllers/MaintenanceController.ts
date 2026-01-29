import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Admin } from 'guards/metadata';
import { DateTime } from 'luxon';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { UserId } from 'models/User';
import { MaintenanceService } from 'services/MaintenanceService';
import { chain } from 'stream-chain';
import { parser as jsonParser } from 'stream-json/jsonl/Parser';
import { stringer as jsonStringer } from 'stream-json/jsonl/Stringer';
import { DATE_FORMAT } from 'utils/constants';
import { Preset } from 'utils/presets';
import { compileTemplate } from 'utils/templates';

@Admin()
@Controller('/api/data')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get()
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

  @Post()
  async import(@Req() req: FastifyRequest) {
    const multipartFile = await req.file();
    if (!multipartFile) {
      throw new Error('No file to import');
    }
    const recordStream = chain([
      multipartFile.file,
      (line: Buffer) => compileTemplate(line.toString()),
      jsonParser(),
    ]);

    await this.maintenanceService.import(recordStream);
  }

  @Delete()
  async destroy() {
    await this.maintenanceService.destroy();
  }

  @Put('/reindex')
  async reindexLanguage(@Query('id') languageId?: LanguageId) {
    if (languageId) {
      const language =
        await this.maintenanceService.reindexLanguage(languageId);
      return language;
    } else {
      const languagesCount = await this.maintenanceService.reindexLanguages();
      return languagesCount;
    }
  }

  @Put('/resync/progress')
  async resyncProgress(@Query('id') languageId: LanguageId) {
    const language = await this.maintenanceService.resyncProgress(languageId);
    return language;
  }

  @Post('/init/:preset')
  async initPreset(
    @ContextDec() ctx: Context,
    @Body('userId') userId: UserId,
    @Param('preset') preset: string,
  ) {
    if (!Object.values(Preset).includes(preset as Preset)) {
      throw new Error('Preset does not exist');
    }

    await this.maintenanceService.initPreset(ctx, userId, preset as Preset);
  }
}
