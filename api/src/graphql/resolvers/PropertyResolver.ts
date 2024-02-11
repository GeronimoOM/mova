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
import { OptionId, PropertyId, PropertyType } from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { PropertyService } from 'services/PropertyService';
import { PropertyTypeMapper } from '../mappers/PropertyTypeMapper';
import { PropertyUnionType } from '../types/PropertyType';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';

@InputType()
export class CreatePropertyInput {
  @Field((type) => ID, { nullable: true })
  id?: PropertyId;

  @Field()
  name: string;

  @Field((type) => PropertyType)
  type: PropertyType;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar, { nullable: true })
  addedAt?: DateTime;

  @Field((type) => [String], { nullable: true })
  options: string[];
}

@InputType()
export class UpdatePropertyInput {
  @Field((type) => ID)
  id: PropertyId;

  @Field({ nullable: true })
  name: string;

  @Field((type) => [UpdateOptionInput], { nullable: true })
  options: UpdateOptionInput[];
}

@InputType()
export class ReorderPropertiesInput {
  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => [ID])
  propertyIds: PropertyId[];
}

@InputType()
export class UpdateOptionInput {
  @Field((type) => ID)
  id: OptionId;

  @Field()
  value: string;
}

@Resolver((of) => PropertyUnionType)
export class PropertyResolver {
  constructor(
    private propertyService: PropertyService,
    private propertyTypeMapper: PropertyTypeMapper,
  ) {}

  @Query((type) => PropertyUnionType, { nullable: true })
  async property(
    @Args('id', { type: () => ID }) id: PropertyId,
  ): Promise<typeof PropertyUnionType | null> {
    const property = await this.propertyService.getById(id).catch(() => null);
    return property ? this.propertyTypeMapper.map(property) : null;
  }

  @Mutation((returns) => PropertyUnionType)
  async createProperty(
    @Args('input') input: CreatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const createdProperty = await this.propertyService.create(input);
    return this.propertyTypeMapper.map(createdProperty);
  }

  @Mutation((returns) => PropertyUnionType)
  async updateProperty(
    @Args('input') input: UpdatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const updatedProperty = await this.propertyService.update({
      ...input,
      ...(input.options && {
        options: new Map(input.options.map(({ id, value }) => [id, value])),
      }),
    });
    return this.propertyTypeMapper.map(updatedProperty);
  }

  @Mutation((returns) => [PropertyUnionType])
  async reorderProperties(
    @Args('input') input: ReorderPropertiesInput,
  ): Promise<Array<typeof PropertyUnionType>> {
    await this.propertyService.reorder(
      input.languageId,
      input.partOfSpeech,
      input.propertyIds,
    );

    const properties = await this.propertyService.getByLanguageId(
      input.languageId,
      input.partOfSpeech,
    );
    return properties.map((property) => this.propertyTypeMapper.map(property));
  }

  @Mutation((returns) => PropertyUnionType)
  async deleteProperty(
    @Args('id', { type: () => ID }) id: PropertyId,
  ): Promise<typeof PropertyUnionType> {
    const deletedProperty = await this.propertyService.delete(id);
    return this.propertyTypeMapper.map(deletedProperty);
  }
}
