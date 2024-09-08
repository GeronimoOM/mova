import { readFileSync, readdirSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export function configLoader() {
  const configs = readdirSync(__dirname)
    .filter((f) => f.endsWith('.yaml'))
    .map((file) => yaml.load(readFileSync(join(__dirname, file), 'utf8')));

  return Object.assign({}, ...configs);
}
