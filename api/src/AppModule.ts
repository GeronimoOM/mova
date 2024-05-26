import { AsyncLocalStorage } from 'node:async_hooks';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MaintenanceController } from './controllers/MaintenanceController';
import { PropertyTypeMapper } from './graphql/mappers/PropertyTypeMapper';
import { WordTypeMapper } from './graphql/mappers/WordTypeMapper';
import { LanguageResolver } from './graphql/resolvers/LanguageResolver';
import { PropertyResolver } from './graphql/resolvers/PropertyResolver';
import { WordResolver } from './graphql/resolvers/WordResolver';
import { DbConnectionManager } from './repositories/DbConnectionManager';
import { LanguageRepository } from './repositories/LanguageRepository';
import { PropertyRepository } from './repositories/PropertyRepository';
import { WordRepository } from './repositories/WordRepository';
import { LanguageService } from './services/LanguageService';
import { PropertyService } from './services/PropertyService';
import { WordService } from './services/WordService';
import { TopicRepository } from './repositories/TopicRepository';
import { TopicService } from './services/TopicService';
import { SearchClient } from './clients/SearchClient';
import { ElasticClientModule } from './clients/ElasticClientModule';
import { TopicResolver } from './graphql/resolvers/TopicResolver';
import { GraphQlModule } from './graphql/GraphQlModule';
import { MaintenanceService } from './services/MaintenanceService';
import { TestController } from 'controllers/TestController';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { Serializer } from 'repositories/Serializer';
import { ChangeService } from 'services/ChangeService';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { ChangeResolver } from 'graphql/resolvers/ChangeResolver';
import { ChangeBuilder } from 'services/ChangeBuilder';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'services/AuthService';
import { AuthGuard, CONFIG_JWT_KEY } from 'guards/AuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { AuthResolver } from 'graphql/resolvers/AuthResolver';

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
