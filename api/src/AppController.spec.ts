import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './AppController';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({}).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.hello()).toBe('Hello World!');
        });
    });
});
