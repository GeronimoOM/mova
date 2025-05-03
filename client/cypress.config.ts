import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'test/e2e/**.cy.ts',
    supportFile: 'test/support/e2e.ts',
    fixturesFolder: 'test/fixtures',
    defaultBrowser: 'chromium',
    viewportWidth: 375,
    viewportHeight: 667,
    defaultCommandTimeout: 10000,

    baseUrl: `http://localhost`,
  },
});
