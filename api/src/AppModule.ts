import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { MaintenanceController } from './MaintenanceController';
import { join } from 'path';
import { AppController } from './AppController';
import { WordIndexClient } from './clients/WordIndexClient';
import { LanguageTypeMapper } from './graphql/mappers/LanguageTypeMapper';
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

@Module({
    imports: [
        GraphQLModule.forRoot<MercuriusDriverConfig>({
            driver: MercuriusDriver,
            autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
            graphiql: true,
        }),
    ],
    providers: [
        LanguageResolver,
        PropertyResolver,
        WordResolver,
        LanguageTypeMapper,
        PropertyTypeMapper,
        WordTypeMapper,
        LanguageService,
        PropertyService,
        WordService,
        WordIndexClient,
        LanguageRepository,
        PropertyRepository,
        WordRepository,
        DbConnectionManager,
    ],
    controllers: [AppController, MaintenanceController],
})
export class AppModule {}
