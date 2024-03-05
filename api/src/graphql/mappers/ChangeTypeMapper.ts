import { Injectable } from '@nestjs/common';
import { ChangeUnionType } from 'graphql/types/ChangeType';
import { Change, ChangeType } from 'models/Change';
import { PropertyTypeMapper } from './PropertyTypeMapper';
import { WordTypeMapper } from './WordTypeMapper';

@Injectable()
export class ChangeTypeMapper {
  constructor(
    private wordTypeMapper: WordTypeMapper,
    private propertyTypeMapper: PropertyTypeMapper,
  ) {}

  map(change: Change): typeof ChangeUnionType {
    switch (change.type) {
      case ChangeType.CreateProperty:
        return {
          ...change,
          created: this.propertyTypeMapper.map(change.created),
        };
      case ChangeType.UpdateProperty:
        return {
          ...change,
          updated: this.propertyTypeMapper.mapUpdate(change.updated),
        };
      case ChangeType.CreateWord:
        return {
          ...change,
          created: this.wordTypeMapper.mapCreate(change.created),
        };
      case ChangeType.UpdateWord:
        return {
          ...change,
          updated: this.wordTypeMapper.mapUpdate(change.updated),
        };
      default:
        return change;
    }
  }
}
