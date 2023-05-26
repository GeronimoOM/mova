import { Module } from '@nestjs/common';
import { ElasticClientManager } from './ElasticClientManager';

@Module({
  providers: [ElasticClientManager],
  exports: [ElasticClientManager],
})
export class ElasticClientModule {}
