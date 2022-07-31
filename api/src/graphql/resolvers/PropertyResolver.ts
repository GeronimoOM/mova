import {
    Args,
    Field,
    ID,
    InputType,
    Mutation,
    Parent,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { LanguageId } from 'src/models/Language';
import { OptionId, PropertyId, PropertyType } from 'src/models/Property';
import { PartOfSpeech } from 'src/models/Word';
import { PropertyService } from 'src/services/PropertyService';
import { PropertyTypeMapper } from '../mappers/PropertyTypeMapper';
import { PropertyUnionType } from '../types/PropertyType';

@InputType()
export class CreatePropertyInput {
    @Field()
    name: string;

    @Field((type) => PropertyType)
    type: PropertyType;

    @Field((type) => ID)
    languageId: LanguageId;

    @Field((type) => PartOfSpeech)
    partOfSpeech: PartOfSpeech;

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
                options: new Map(
                    input.options.map(({ id, value }) => [id, value]),
                ),
            }),
        });
        return this.propertyTypeMapper.map(updatedProperty);
    }

    @Mutation((returns) => PropertyUnionType)
    async deleteProperty(
        @Args('id', { type: () => ID }) id: PropertyId,
    ): Promise<typeof PropertyUnionType> {
        const deletedProperty = await this.propertyService.delete(id);
        return this.propertyTypeMapper.map(deletedProperty);
    }
}
