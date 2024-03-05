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
import { GraphQLModule } from './graphql/GraphQLModule';
import { MaintenanceService } from './services/MaintenanceService';
import { TestController } from 'controllers/TestController';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { Serializer } from 'repositories/Serializer';
import { ChangeService } from 'services/ChangeService';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { ChangeResolver } from 'graphql/resolvers/ChangeResolver';
import { ChangeBuilder } from 'services/ChangeBuilder';

@Module({
  imports: [GraphQLModule, ElasticClientModule],
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
  ],
  controllers: [TestController, MaintenanceController],
})
export class AppModule {}
