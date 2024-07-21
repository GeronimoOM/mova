import {
  Args,
  Context as ContextDec,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
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
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: CreatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const createdProperty = await this.propertyService.create(ctx, input);
    return this.propertyTypeMapper.map(createdProperty);
  }

  @Mutation((returns) => PropertyUnionType)
  async updateProperty(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: UpdatePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const updatedProperty = await this.propertyService.update(
      ctx,
      this.propertyTypeMapper.mapFromUpdateInput(input),
    );
    return this.propertyTypeMapper.map(updatedProperty);
  }

  @Mutation((returns) => [PropertyUnionType])
  async reorderProperties(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: ReorderPropertiesInput,
  ): Promise<Array<typeof PropertyUnionType>> {
    await this.propertyService.reorder(ctx, input);

    const properties = await this.propertyService.getByLanguageId(
      input.languageId,
      input.partOfSpeech,
    );
    return properties.map((property) => this.propertyTypeMapper.map(property));
  }

  @Mutation((returns) => PropertyUnionType)
  async deleteProperty(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: DeletePropertyInput,
  ): Promise<typeof PropertyUnionType> {
    const deletedProperty = await this.propertyService.delete(ctx, input);
    return this.propertyTypeMapper.map(deletedProperty);
  }
}
