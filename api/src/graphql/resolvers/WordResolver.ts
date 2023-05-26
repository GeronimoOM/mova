import {
  Args,
  Field,
  ID,
  InputType,
  Mutation,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { LanguageId } from 'models/Language';
import { PartOfSpeech, WordId } from 'models/Word';
import { WordType } from '../types/WordType';
import { UpdatePropertyValueParams, WordService } from 'services/WordService';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import { OptionId, PropertyId } from 'models/Property';

@InputType()
export class CreateWordInput {
  @Field()
  original: string;

  @Field()
  translation: string;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => [UpdatePropertyValueInput], { nullable: true })
  properties?: UpdatePropertyValueInput[];
}

@InputType()
export class UpdateWordInput {
  @Field((type) => ID)
  id: WordId;

  @Field({ nullable: true })
  original?: string;

  @Field({ nullable: true })
  translation?: string;

  @Field((type) => [UpdatePropertyValueInput], { nullable: true })
  properties?: UpdatePropertyValueInput[];
}

@InputType()
export class UpdatePropertyValueInput {
  @Field((type) => ID)
  id: PropertyId;

  @Field({ nullable: true })
  text?: string;

  @Field((type) => ID, { nullable: true })
  option?: OptionId;
}

@Resolver((of) => WordType)
export class WordResolver {
  constructor(
    private wordService: WordService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query((type) => WordType, { nullable: true })
  async word(
    @Args('id', { type: () => ID }) id: WordId,
  ): Promise<WordType | null> {
    const word = await this.wordService.getById(id);
    return word ? this.wordTypeMapper.map(word) : null;
  }

  @Mutation((returns) => WordType)
  async createWord(@Args('input') input: CreateWordInput): Promise<WordType> {
    const createdWord = await this.wordService.create({
      ...input,
      properties: this.mapPropertyValues(input.properties),
    });
    return this.wordTypeMapper.map(createdWord);
  }

  @Mutation((returns) => WordType)
  async updateWord(@Args('input') input: UpdateWordInput): Promise<WordType> {
    const updatedWord = await this.wordService.update({
      ...input,
      properties: this.mapPropertyValues(input.properties),
    });
    return this.wordTypeMapper.map(updatedWord);
  }

  @Mutation((returns) => WordType)
  async deleteWord(
    @Args('id', { type: () => ID }) id: WordId,
  ): Promise<WordType> {
    const deletedWord = await this.wordService.delete(id);
    return this.wordTypeMapper.map(deletedWord);
  }

  mapPropertyValues(
    input?: UpdatePropertyValueInput[],
  ): Map<PropertyId, UpdatePropertyValueParams> | undefined {
    if (!input) {
      return;
    }
    return new Map(
      input.map((propertyInput) => [
        propertyInput.id,
        this.mapPropertyValue(propertyInput),
      ]),
    );
  }

  mapPropertyValue(input: UpdatePropertyValueInput): UpdatePropertyValueParams {
    return {
      ...(input.text && { text: input.text }),
      ...(input.option && { option: input.option }),
    };
  }
}
