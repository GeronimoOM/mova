import { Controller, Get, Query } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import { OptionProperty, PropertyId, PropertyType } from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { LanguageService } from 'services/LanguageService';
import { PropertyService } from 'services/PropertyService';
import { TopicService } from 'services/TopicService';
import { UpdatePropertyValueParams, WordService } from 'services/WordService';

@Controller('/maintenance')
export class MaintenanceController {
    constructor(
        private languageService: LanguageService,
        private propertyService: PropertyService,
        private wordService: WordService,
        private topicService: TopicService,
    ) {}

    @Get('/generate')
    async generateTestData(@Query('name') name: string) {
        const language = await this.languageService.create({ name });
        const [nounTextProp, nounOptionProp, adjTextProp] = await Promise.all([
            this.propertyService.create({
                name: `Noun Text Property (${name})`,
                type: PropertyType.Text,
                partOfSpeech: PartOfSpeech.Noun,
                languageId: language.id,
            }),
            this.propertyService.create({
                name: `Noun Option Property (${name})`,
                type: PropertyType.Option,
                partOfSpeech: PartOfSpeech.Noun,
                languageId: language.id,
                options: ['Red', 'Blue', 'Green'],
            }),
            this.propertyService.create({
                name: `Adjective Text Property (${name})`,
                type: PropertyType.Text,
                partOfSpeech: PartOfSpeech.Adj,
                languageId: language.id,
            }),
        ]);

        const [animals, sports] = await Promise.all([
            this.topicService.create({
                name: 'Animals',
                languageId: language.id,
            }),
            this.topicService.create({
                name: 'Sports',
                languageId: language.id,
            }),
        ]);

        const [dog, swim, run] = await Promise.all([
            this.wordService.create({
                original: `koer (${name})`,
                translation: 'dog',
                partOfSpeech: PartOfSpeech.Noun,
                languageId: language.id,
                properties: new Map<PropertyId, UpdatePropertyValueParams>([
                    [
                        nounTextProp.id,
                        {
                            text: 'koera',
                        },
                    ],
                    [
                        nounOptionProp.id,
                        {
                            option: (nounOptionProp as OptionProperty).options
                                .keys()
                                .next().value,
                        },
                    ],
                ]),
            }),

            this.wordService.create({
                original: `ujuma (${name})`,
                translation: 'to swim',
                partOfSpeech: PartOfSpeech.Verb,
                languageId: language.id,
            }),

            this.wordService.create({
                original: `jooskma (${name})`,
                translation: 'to run',
                partOfSpeech: PartOfSpeech.Verb,
                languageId: language.id,
            }),

            this.wordService.create({
                original: `väike (${name})`,
                translation: 'small',
                partOfSpeech: PartOfSpeech.Adj,
                languageId: language.id,
                properties: new Map<PropertyId, UpdatePropertyValueParams>([
                    [
                        adjTextProp.id,
                        {
                            text: 'väikse',
                        },
                    ],
                ]),
            }),

            this.wordService.create({
                original: `suur (${name})`,
                translation: 'big',
                partOfSpeech: PartOfSpeech.Adj,
                languageId: language.id,
            }),

            this.wordService.create({
                original: `isegi (${name})`,
                translation: 'even',
                partOfSpeech: PartOfSpeech.Misc,
                languageId: language.id,
            }),
        ]);

        await Promise.all(
            Array.from(Array(30).keys()).map((i) =>
                this.wordService.create({
                    original: `word ${i + 1}`,
                    translation: `translation ${i + 1}`,
                    partOfSpeech: PartOfSpeech.Noun,
                    languageId: language.id,
                }),
            ),
        );

        await Promise.all([
            this.topicService.addWord(animals.id, dog.id),
            this.topicService.addWord(sports.id, swim.id),
            this.topicService.addWord(sports.id, run.id),
        ]);

        return `Generated language ${language.name} (${language.id}) with data`;
    }

    @Get('/clear')
    async clearLanguage(@Query('id') languageId: LanguageId) {
        const language = await this.languageService.getById(languageId);
        if (!language) {
            return 'Language does not exist';
        }

        await this.wordService.deleteForLanguage(languageId);
        await this.topicService.deleteForLanguage(languageId);
        await this.propertyService.deleteForLanguage(languageId);
        await this.languageService.delete(languageId);

        return `Cleared language ${language.name} (${languageId})`;
    }

    @Get('/reindex')
    async reindexLanguage(@Query('id') languageId: LanguageId) {
        const language = await this.languageService.getById(languageId);
        if (!language) {
            return 'Language does not exist';
        }

        await Promise.all([
            this.wordService.indexLanguage(languageId),
            this.topicService.indexLanguage(languageId),
        ]);

        return `Reindexed language ${language.name} (${languageId})`;
    }
}
