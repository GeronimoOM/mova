import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ChangeTypeMapper } from 'graphql/mappers/ChangeTypeMapper';
import { AuthResolver } from 'graphql/resolvers/AuthResolver';
import { ChangeResolver } from 'graphql/resolvers/ChangeResolver';
import { ExerciseResolver } from 'graphql/resolvers/ExerciseResolver';
import { OptionPropertyResolver } from 'graphql/resolvers/OptionPropertyResolver';
import { ProgressResolver } from 'graphql/resolvers/ProgressResolver';
import { UserResolver } from 'graphql/resolvers/UserResolver';
import { AuthGuard } from 'guards/AuthGuard';
import { ContextMiddleware } from 'middleware/ContextMiddleware';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { ProgressRepository } from 'repositories/ProgressRepository';
import { Serializer } from 'repositories/Serializer';
import { UserRepository } from 'repositories/UserRepository';
import { AuthService } from 'services/AuthService';
import { ChangeBuilder } from 'services/ChangeBuilder';
import { ChangeService } from 'services/ChangeService';
import { EncryptionService } from 'services/EncryptionService';
import { ExerciseService } from 'services/ExerciseService';
import { ProgressService } from 'services/ProgressService';
import { UserService } from 'services/UserService';
import { ElasticClientModule } from './clients/ElasticClientModule';
import { SearchClient } from './clients/SearchClient';
import { configLoader } from './config';
import { MaintenanceController } from './controllers/MaintenanceController';
import { GraphQlModule } from './graphql/GraphQlModule';
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
import { MaintenanceService } from './services/MaintenanceService';
import { PropertyService } from './services/PropertyService';
import { WordService } from './services/WordService';

@Module({
  imports: [
    GraphQlModule,
    ElasticClientModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configLoader],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
    }),
  ],
  providers: [
    AuthResolver,
    LanguageResolver,
    PropertyResolver,
    OptionPropertyResolver,
    ChangeResolver,
    WordResolver,
    ExerciseResolver,
    ProgressResolver,
    UserResolver,
    PropertyTypeMapper,
    WordTypeMapper,
    ChangeTypeMapper,
    AuthService,
    ExerciseService,
    LanguageService,
    PropertyService,
    WordService,
    ChangeService,
    ProgressService,
    UserService,
    MaintenanceService,
    EncryptionService,
    SearchClient,
    ChangeBuilder,
    LanguageRepository,
    PropertyRepository,
    WordRepository,
    ChangeRepository,
    ProgressRepository,
    UserRepository,
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
  controllers: [MaintenanceController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
