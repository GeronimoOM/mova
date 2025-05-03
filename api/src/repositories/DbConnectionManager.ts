import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import { AsyncLocalStorage } from 'node:async_hooks';

interface TransactionContext {
  transaction: Knex.Transaction;
}

type DbServiceConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

@Injectable()
export class DbConnectionManager implements OnApplicationBootstrap {
  private connection: Knex | undefined;

  constructor(
    private asyncLocalStorage: AsyncLocalStorage<TransactionContext>,
    private configService: ConfigService,
  ) {}

  getConnection(): Knex {
    const trxContext = this.asyncLocalStorage.getStore();
    if (trxContext) {
      return trxContext.transaction;
    }

    if (!this.connection) {
      this.connection = this.initConnection();
    }

    return this.connection;
  }

  transactionally<T>(fn: () => Promise<T>): Promise<T> {
    const connection = this.getConnection();
    if (connection.isTransaction) {
      return fn();
    }

    return connection.transaction((transaction) =>
      this.asyncLocalStorage.run({ transaction }, fn),
    );
  }

  async onApplicationBootstrap() {
    const connection = this.getConnection();
    await connection.migrate.latest();
    Logger.log('Database migrated');
  }

  private initConnection(): Knex {
    const { host, port, user, password, database } =
      this.configService.getOrThrow<DbServiceConfig>('env.database');

    return knex({
      client: 'mysql',
      connection: {
        host,
        port,
        user,
        password,
        database,
        dateStrings: true,
      },
      migrations: {
        directory: 'dist/repositories/migrations',
        loadExtensions: ['.js'],
      },
    });
  }
}
