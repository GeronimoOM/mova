import { Module } from '@nestjs/common';
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
import { AsyncLocalStorage } from 'node:async_hooks';

@Module({
  imports: [GraphQlModule, ElasticClientModule],
  providers: [
    LanguageResolver,
    PropertyResolver,
    ChangeResolver,
    WordResolver,
    TopicResolver,
    PropertyTypeMapper,
    WordTypeMapper,
    ChangeTypeMapper,
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
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  controllers: [TestController, MaintenanceController],
})
export class AppModule {}
