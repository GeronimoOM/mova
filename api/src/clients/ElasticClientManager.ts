import * as elastic from '@elastic/elasticsearch';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { retry } from 'utils/retry';

const CONNECT_RETRY = 5000; // ms

type IndexServiceConfig = {
  host: string;
  port: number;
};

@Injectable()
export class ElasticClientManager implements OnApplicationBootstrap {
  private client: elastic.Client;

  constructor(private configService: ConfigService) {}

  getClient() {
    if (!this.client) {
      this.client = this.initClient();
    }

    return this.client;
  }

  private initClient(): elastic.Client {
    const { host, port } =
      this.configService.getOrThrow<IndexServiceConfig>('env.index');

    return new elastic.Client({
      node: `http://${host}:${port}`,
    });
  }

  async onApplicationBootstrap() {
    await retry(async () => {
      this.client = this.initClient();

      await this.client.ping();
    }, CONNECT_RETRY);

    Logger.log('ElasticSearch client connected');
  }
}
