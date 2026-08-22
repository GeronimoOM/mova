import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoader } from '../config';
import { AiClient } from './AiClient';

@Module({
  providers: [AiClient],
  exports: [AiClient],
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
    }),
  ],
})
export class AiClientModule {}
