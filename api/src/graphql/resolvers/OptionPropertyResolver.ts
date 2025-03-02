import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
  OptionPropertyType,
  OptionUsageType,
} from 'graphql/types/PropertyType';
import { WordService } from 'services/WordService';

@Resolver(() => OptionPropertyType)
export class OptionPropertyResolver {
  constructor(private wordService: WordService) {}

  @ResolveField(() => [OptionUsageType])
  async optionsUsage(
    @Parent() property: OptionPropertyType,
  ): Promise<OptionUsageType[]> {
    const wordCounts = await this.wordService.getCountByPropertyOptions(
      property.languageId,
      property.id,
      property.partOfSpeech,
    );

    return Object.entries(wordCounts).map(([optionId, count]) => ({
      id: optionId,
      count,
    }));
  }
}
