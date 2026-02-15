import { PartOfSpeech, PropertyFieldsFragment } from '../../api/types/graphql';
import { partsOfSpeech } from '../../utils/partsOfSpeech';

export type PropertiesPartOfSpeechDivider = {
  type: 'divider';
  partOfSpeech: PartOfSpeech;
};

export function divideProperties(
  properties: PropertyFieldsFragment[],
): Array<PropertyFieldsFragment | PropertiesPartOfSpeechDivider> {
  const dividedProperties: Array<
    PropertyFieldsFragment | PropertiesPartOfSpeechDivider
  > = [];
  const sortedProperties = properties.toSorted((p1, p2) => {
    const p1posIndex = partsOfSpeech.indexOf(p1.partOfSpeech);
    const p2posIndex = partsOfSpeech.indexOf(p2.partOfSpeech);
    return p1posIndex === p2posIndex
      ? p1.order - p2.order
      : p1posIndex - p2posIndex;
  });

  let lastDivider: PropertiesPartOfSpeechDivider | null = null;
  for (const property of sortedProperties) {
    if (!lastDivider || property.partOfSpeech !== lastDivider.partOfSpeech) {
      lastDivider = {
        type: 'divider',
        partOfSpeech: property.partOfSpeech,
      };

      dividedProperties.push(lastDivider);
    }

    dividedProperties.push(property);
  }

  return dividedProperties;
}

export function isDivider(
  propertyOrDivider: PropertyFieldsFragment | PropertiesPartOfSpeechDivider,
): propertyOrDivider is PropertiesPartOfSpeechDivider {
  return (
    (propertyOrDivider as PropertiesPartOfSpeechDivider).type === 'divider'
  );
}
