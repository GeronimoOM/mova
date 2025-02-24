import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { PropertyId } from 'models/Property';
import { PropertyService } from 'services/PropertyService';
import { PropertyTypeMapper } from '../mappers/PropertyTypeMapper';
import {
  CreatePropertyInput,
  DeletePropertyInput,
  PropertyUnionType,
  ReorderPropertiesInput,
  UpdatePropertyInput,
} from '../types/PropertyType';

@Resolver(() => PropertyUnionType)
export class PropertyResolver {
  constructor(
    private propertyService: PropertyService,
    private propertyTypeMapper: PropertyTypeMapper,
  ) {}

  @Query(() => PropertyUnionType, { nullable: true })
  async property(
    @ContextDec() ctx: Context,
    @Args('id', { type: () => ID }) id: PropertyId,
  ): Promise<typeof PropertyUnionType | null> {
    const property = await this.propertyService
      .getById(ctx, id)
      .catch(() => null);
    return property ? this.propertyTypeMapper.map(property) : null;
  }

  @Mutation(() => PropertyUnionType)
  async createProperty(
    @ContextDec() ctx: Context,
    @Args('input') input: CreatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const createdProperty = await this.propertyService.create(
      ctx,
      this.propertyTypeMapper.mapFromCreateInput(input),
    );
    return this.propertyTypeMapper.map(createdProperty);
  }

  @Mutation(() => PropertyUnionType)
  async updateProperty(
    @ContextDec() ctx: Context,
    @Args('input') input: UpdatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const updatedProperty = await this.propertyService.update(ctx, input);
    return this.propertyTypeMapper.map(updatedProperty);
  }

  @Mutation(() => [PropertyUnionType])
  async reorderProperties(
    @ContextDec() ctx: Context,
    @Args('input') input: ReorderPropertiesInput,
  ): Promise<Array<typeof PropertyUnionType>> {
    await this.propertyService.reorder(ctx, input);

    const properties = await this.propertyService.getByLanguageId(
      ctx,
      input.languageId,
      input.partOfSpeech,
    );
    return properties.map((property) => this.propertyTypeMapper.map(property));
  }

  @Mutation(() => PropertyUnionType)
  async deleteProperty(
    @ContextDec() ctx: Context,
    @Args('input') input: DeletePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const deletedProperty = await this.propertyService.delete(ctx, input);
    return this.propertyTypeMapper.map(deletedProperty);
  }
}
