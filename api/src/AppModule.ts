import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TestController } from 'controllers/TestController';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { AuthResolver } from 'graphql/resolvers/AuthResolver';
import { ChangeResolver } from 'graphql/resolvers/ChangeResolver';
import { AuthGuard, CONFIG_JWT_KEY } from 'guards/AuthGuard';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { Serializer } from 'repositories/Serializer';
import { AuthService } from 'services/AuthService';
import { ChangeBuilder } from 'services/ChangeBuilder';
import { ChangeService } from 'services/ChangeService';
import { ElasticClientModule } from './clients/ElasticClientModule';
import { SearchClient } from './clients/SearchClient';
import { MaintenanceController } from './controllers/MaintenanceController';
import { GraphQlModule } from './graphql/GraphQlModule';
import { PropertyTypeMapper } from './graphql/mappers/PropertyTypeMapper';
import { WordTypeMapper } from './graphql/mappers/WordTypeMapper';
import { LanguageResolver } from './graphql/resolvers/LanguageResolver';
import { PropertyResolver } from './graphql/resolvers/PropertyResolver';
import { TopicResolver } from './graphql/resolvers/TopicResolver';
import { WordResolver } from './graphql/resolvers/WordResolver';
import { DbConnectionManager } from './repositories/DbConnectionManager';
import { LanguageRepository } from './repositories/LanguageRepository';
import { PropertyRepository } from './repositories/PropertyRepository';
import { TopicRepository } from './repositories/TopicRepository';
import { WordRepository } from './repositories/WordRepository';
import { LanguageService } from './services/LanguageService';
import { MaintenanceService } from './services/MaintenanceService';
import { PropertyService } from './services/PropertyService';
import { TopicService } from './services/TopicService';
import { WordService } from './services/WordService';

@Module({
  imports: [
    GraphQlModule,
    ElasticClientModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(CONFIG_JWT_KEY),
      }),
    }),
  ],
  providers: [
    AuthResolver,
    LanguageResolver,
    PropertyResolver,
    ChangeResolver,
    WordResolver,
    TopicResolver,
    PropertyTypeMapper,
    WordTypeMapper,
    ChangeTypeMapper,
    AuthService,
    LanguageService,
    PropertyService,
    WordService,
    TopicService,
    ChangeService,
    MaintenanceService,
    SearchClient,
    ChangeBuilder,
    LanguageRepository,
    PropertyRepository,
    WordRepository,
    TopicRepository,
    ChangeRepository,
    DbConnectionManager,
    Serializer,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  controllers: [TestController, MaintenanceController],
})
export class AppModule {}
