import {
    Args,
    Field,
    InputType,
    Mutation,
    Resolver,
    ID,
    Parent,
    ResolveField,
} from '@nestjs/graphql';
import { WordTypeMapper } from 'graphql/mappers/WordTypeMapper';
import { PageArgsType } from 'graphql/types/PageType';
import { TopicType } from 'graphql/types/TopicType';
import { WordPageType, WordType } from 'graphql/types/WordType';
import { LanguageId } from 'models/Language';
import { Page, mapPage } from 'models/Page';
import { TopicId } from 'models/Topic';
import { PartOfSpeech, WordId, WordOrder } from 'models/Word';
import { TopicService } from 'services/TopicService';
import { WordService } from 'services/WordService';

@InputType()
export class CreateTopicInput {
    @Field()
    name: string;

    @Field((type) => ID)
    languageId: LanguageId;
}

@Resolver((of) => TopicType)
export class TopicResolver {
    constructor(
        private topicService: TopicService,
        private wordService: WordService,
        private wordTypeMapper: WordTypeMapper,
    ) {}

    @ResolveField((type) => WordPageType)
    async words(
        @Parent() topic: TopicType,
        @Args() pageArgs: PageArgsType,
        @Args('query', { nullable: true }) query?: string,
        @Args('partOfSpeech', { type: () => PartOfSpeech, nullable: true })
        partOfSpeech?: PartOfSpeech,
        @Args('order', { type: () => WordOrder, nullable: true })
        order: WordOrder = WordOrder.Chronological,
    ): Promise<Page<WordType>> {
        const wordPage = await this.wordService.getPage({
            languageId: topic.languageId,
            query,
            partOfSpeech,
            topic: topic.id,
            order,
            ...pageArgs,
        });

        return mapPage(wordPage, (word) => this.wordTypeMapper.map(word));
    }

    @Mutation((returns) => TopicType)
    async createTopic(
        @Args('input') input: CreateTopicInput,
    ): Promise<TopicType> {
        const createdTopic = await this.topicService.create(input);
        return createdTopic;
    }

    @Mutation((returns) => TopicType)
    async deleteTopic(
        @Args('id', { type: () => ID }) id: TopicId,
    ): Promise<TopicType> {
        const deletedTopic = await this.topicService.delete(id);
        return deletedTopic;
    }

    @Mutation((returns) => TopicType)
    async addTopicWord(
        @Args('topicId', { type: () => ID }) topicId: TopicId,
        @Args('wordId', { type: () => ID }) wordId: WordId,
    ): Promise<TopicType> {
        const topic = await this.topicService.addWord(topicId, wordId);
        return topic;
    }

    @Mutation((returns) => TopicType)
    async removeTopicWord(
        @Args('topicId', { type: () => ID }) topicId: TopicId,
        @Args('wordId', { type: () => ID }) wordId: WordId,
    ): Promise<TopicType> {
        const topic = await this.topicService.removeWord(topicId, wordId);
        return topic;
    }
}
