import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import {
  GetPropertiesDocument,
  PropertyFieldsFragment,
} from '../../api/types/graphql';
import { useDebouncedValue } from '../../utils/useDebouncedValue.ts';
import { useLanguageContext } from '../LanguageContext.tsx';
import { Icon } from '../common/Icon.tsx';
import { Input } from '../common/Input.tsx';
import { PartOfSpeechPill } from '../common/PartOfSpeechPill.tsx';
import * as styles from './PropertySelectList.css.ts';
import { divideProperties, isDivider } from './divideProperties.ts';

const SEARCH_DELAY_MS = 300;

export type PropertySelectListProps = {
  listItemRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (property: PropertyFieldsFragment) => void;
};

export const PropertySelectList = ({
  listItemRef,
  onSelect,
}: PropertySelectListProps) => {
  const [selectedLanguageId] = useLanguageContext();
  const [query, setQuery] = useState('');

  const { data: propertiesQuery } = useQuery(GetPropertiesDocument, {
    variables: {
      languageId: selectedLanguageId!,
    },
  });
  const properties = propertiesQuery?.language?.properties;
  const debouncedQuery = useDebouncedValue(query, SEARCH_DELAY_MS);

  const filteredProperties = useMemo(
    () =>
      divideProperties(
        (debouncedQuery
          ? properties?.filter((prop) => prop.name.includes(debouncedQuery))
          : properties) ?? [],
      ),
    [properties, debouncedQuery],
  );

  return (
    <div
      className={styles.wrapper}
      style={{ width: listItemRef?.current?.clientWidth }}
    >
      <Input
        value={query}
        onChange={setQuery}
        text={'translation'}
        left={<Icon icon={PiMagnifyingGlassBold} />}
      />

      <div className={styles.list}>
        {filteredProperties.map((propertyOrDivider) =>
          isDivider(propertyOrDivider) ? (
            <div
              key={propertyOrDivider.partOfSpeech}
              className={styles.divider}
            >
              <PartOfSpeechPill
                partOfSpeech={propertyOrDivider.partOfSpeech}
                full
                disabled
              />
            </div>
          ) : (
            <div
              key={propertyOrDivider.id}
              onClick={() => onSelect(propertyOrDivider)}
              className={styles.listItem}
            >
              {propertyOrDivider.name}
            </div>
          ),
        )}
      </div>
    </div>
  );
};
