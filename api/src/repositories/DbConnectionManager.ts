import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import knex, { Knex } from 'knex';

interface TransactionContext {
  transaction: Knex.Transaction;
}

@Injectable()
export class DbConnectionManager implements OnApplicationBootstrap {
  private connection: Knex | undefined;

  constructor(
    private asyncLocalStorage: AsyncLocalStorage<TransactionContext>,
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
    //TODO extract
    return knex({
      client: 'mysql',
      connection: {
        host: 'mova-db',
        port: 3306,
        user: 'mova',
        password: 'secret-to-mova-db',
        database: 'mova',
        dateStrings: true,
      },
      migrations: {
        directory: 'dist/repositories/migrations',
        loadExtensions: ['.js'],
      },
    });
  }
}
