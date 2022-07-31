import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import knex, { Knex } from 'knex';

@Injectable()
export class DbConnectionManager implements OnApplicationBootstrap {
    private connection: Knex | undefined;

    getConnection(): Knex {
        if (!this.connection) {
            // TODO use env for production
            this.connection = knex({
                client: 'mysql',
                connection: {
                    host: 'mova-db',
                    port: 3306,
                    user: 'mova',
                    password: 'secret-to-mova-db',
                    database: 'mova',
                },
                migrations: {
                    directory: 'dist/repositories/migrations',
                    loadExtensions: ['.js'],
                },
            });
        }
        return this.connection;
    }

    async onApplicationBootstrap() {
        const connection = this.getConnection();
        await connection.migrate.up();
        Logger.log('Database migrated');
    }
}