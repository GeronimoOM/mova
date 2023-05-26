import * as elastic from '@elastic/elasticsearch';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { retry } from 'utils/retry';

const CONNECT_RETRY = 5000; // ms

@Injectable()
export class ElasticClientManager implements OnApplicationBootstrap {
  private client: elastic.Client;

  getClient() {
    if (!this.client) {
      this.client = this.initClient();
    }

    return this.client;
  }

  private initClient(): elastic.Client {
    //TODO extract
    return new elastic.Client({
      node: 'http://mova-index:9200',
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
