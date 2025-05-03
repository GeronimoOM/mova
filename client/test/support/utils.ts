import * as path from 'path';
import * as yaml from 'yamljs';

const SECRETS_PATH = path.join(
  __dirname,
  '../../../api/src/config/secret.yaml',
);

export function readConfig<T>(path: string): Cypress.Chainable<T> {
  return cy.readFile(path).then((str) => {
    return yaml.parse(str);
  });
}

export type Credentials = {
  name: string;
  password: string;
};

export function readSecrets(): Cypress.Chainable<Credentials> {
  return readConfig<{
    admin: Credentials;
  }>(SECRETS_PATH).then(({ admin }) => admin);
}

export function uploadFormData(fixture: string): Cypress.Chainable<FormData> {
  return cy
    .fixture(fixture, 'binary')
    .then((file) => Cypress.Blob.binaryStringToBlob(file))
    .then((blob) => {
      const formData = new FormData();
      formData.append('file', blob);

      return formData;
    });
}

export const promisifyIdbRequest = (request: IDBRequest): Promise<void> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
