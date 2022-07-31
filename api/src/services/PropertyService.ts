import { v1 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { LanguageId } from 'src/models/Language';
import {
    BaseProperty,
    isOptionProperty,
    OptionId,
    OptionProperty,
    Property,
    PropertyId,
    PropertyType,
    TextProperty,
} from 'src/models/Property';
import { PropertyRepository } from 'src/repositories/PropertyRepository';
import { LanguageService } from './LanguageService';
import { PartOfSpeech } from 'src/models/Word';

export interface CreateBasePropertyParams {
    name: string;
    type: PropertyType;
    languageId: LanguageId;
    partOfSpeech: PartOfSpeech;
}

export interface CreateTextPropertyParams extends CreateBasePropertyParams {
    type: PropertyType.Text;
}

export interface CreateOptionPropertyParams extends CreateBasePropertyParams {
    type: PropertyType.Option;
    options: string[];
}

export type CreatePropertyParams =
    | CreateTextPropertyParams
    | CreateOptionPropertyParams;

export interface UpdatePropertyParams {
    id: PropertyId;
    name?: string;
    options?: Map<OptionId, string>;
}

@Injectable()
export class PropertyService {
    constructor(
        private propertyRepository: PropertyRepository,
        private languageService: LanguageService,
    ) {}

    async getByLanguageId(
        languageId: LanguageId,
        partOfSpeech?: PartOfSpeech,
    ): Promise<Property[]> {
        return await this.propertyRepository.getByLanguageId(
            languageId,
            partOfSpeech,
        );
    }

    async getByIds(ids: PropertyId[]): Promise<Property[]> {
        return await this.propertyRepository.getByIds(ids);
    }

    async create(params: CreatePropertyParams): Promise<Property> {
        if (!(await this.languageService.getById(params.languageId))) {
            throw new Error('Language does not exist');
        }

        const baseProperty: BaseProperty = {
            id: uuid(),
            name: params.name,
            type: params.type,
            languageId: params.languageId,
            partOfSpeech: params.partOfSpeech,
        };

        let property: Property;
        switch (baseProperty.type) {
            case PropertyType.Text:
                property = baseProperty as TextProperty;
                break;
            case PropertyType.Option:
                const options = (params as CreateOptionPropertyParams).options;
                if (!options || options.length < 2) {
                    throw new Error('Options are required');
                }
                property = {
                    ...baseProperty,
                    options: new Map(options.map((option) => [uuid(), option])),
                } as OptionProperty;
                break;
        }

        await this.propertyRepository.create(property);
        return property;
    }

    async update(params: UpdatePropertyParams): Promise<Property> {
        const property = await this.propertyRepository.getById(params.id);
        if (!property) {
            throw new Error('Property does not exist');
        }

        if (params.name) {
            property.name = params.name;
        }

        if (isOptionProperty(property)) {
            if (params.options) {
                for (const [optionId, optionValue] of params.options) {
                    if (!property.options.has(optionId)) {
                        throw new Error('Option does not exist');
                    }
                    property.options.set(optionId, optionValue);
                }
            }
        }

        await this.propertyRepository.update(property);
        return property;
    }

    async delete(id: PropertyId): Promise<Property> {
        const property = await this.propertyRepository.getById(id);
        if (!property) {
            throw new Error('Property does not exist');
        }

        await this.propertyRepository.delete(id);
        return property;
    }
}
