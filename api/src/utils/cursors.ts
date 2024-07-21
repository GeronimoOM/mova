import { Logger } from '@nestjs/common';
import { Static, TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';

export function encodeCursor<T>(cursorValue: T) {
  return Buffer.from(JSON.stringify(cursorValue)).toString('base64');
}

export function decodeCursor<T extends TSchema>(
  hash: string,
  schema: T,
): Static<T> | null {
  try {
    const cursor = JSON.parse(Buffer.from(hash, 'base64').toString('utf-8'));
    const validator = TypeCompiler.Compile(schema);
    if (!validator.Check(cursor)) {
      Logger.log('Invalid cursor', cursor, [...validator.Errors(cursor)]);

      return null;
    }

    return Value.Decode(schema, cursor);
  } catch (err) {
    Logger.log('Invalid cursor', hash);

    return null;
  }
}
