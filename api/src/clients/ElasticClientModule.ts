import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoader } from '../config';
import { ElasticClientManager } from './ElasticClientManager';

@Module({
  providers: [ElasticClientManager],
  exports: [ElasticClientManager],
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
    }),
  ],
})
export class ElasticClientModule {}
