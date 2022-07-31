import { Injectable } from '@nestjs/common';
import { Language } from 'src/models/Language';
import { LanguageType } from '../types/LanguageType';

@Injectable()
export class LanguageTypeMapper {
    map(language: Language): LanguageType {
        return {
            id: language.id,
            name: language.name,
        };
    }
}
