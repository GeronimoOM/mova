import { Injectable } from '@nestjs/common';

import { hash, verify } from 'argon2';

@Injectable()
export class EncryptionService {
  async hash(value: string): Promise<string> {
    return await hash(value);
  }

  async verify(hash: string, value: string): Promise<boolean> {
    return await verify(hash, value);
  }
}
