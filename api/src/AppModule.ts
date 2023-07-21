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

@Module({
  imports: [GraphQLModule, ElasticClientModule],
  providers: [
    LanguageResolver,
    PropertyResolver,
    WordResolver,
    TopicResolver,
    PropertyTypeMapper,
    WordTypeMapper,
    LanguageService,
    PropertyService,
    WordService,
    TopicService,
    MaintenanceService,
    SearchClient,
    LanguageRepository,
    PropertyRepository,
    WordRepository,
    TopicRepository,
    DbConnectionManager,
  ],
  controllers: [MaintenanceController],
})
export class AppModule {}
