import { useLazyQuery } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { useReorderProperties } from '../../api/mutations';
import { GetPropertiesDocument, PartOfSpeech } from '../../api/types/graphql';
import { areEqual, toRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './PropertiesList.css';
import { PropertyListItem, PropertyListItemOverlay } from './PropertyListItem';

export type PropertiesListProps = {
  selectedPartOfSpeech: PartOfSpeech;
};

export const PropertiesList: React.FC<PropertiesListProps> = ({
  selectedPartOfSpeech,
}) => {
  const [selectedLanguageId] = useLanguageContext();

  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [orderedPropertyIds, setOrderedPropertyIds] = useState<string[]>([]);

  const [fetchProperties, propertiesQuery] = useLazyQuery(
    GetPropertiesDocument,
  );
  const properties = propertiesQuery.data?.language?.properties;
  const propertiesById = useMemo(
    () =>
      properties ? toRecord(properties, (property) => property.id) : undefined,
    [properties],
  );
  const orderedProperties = useMemo(() => {
    if (!propertiesById) {
      return undefined;
    }

    return orderedPropertyIds.map((id) => propertiesById[id]);
  }, [propertiesById, orderedPropertyIds]);

  const [reorderPropertiesMutate] = useReorderProperties();

  const reorderProperties = useCallback(() => {
    const propertyIds = properties?.map((property) => property.id);
    if (!selectedLanguageId || !propertyIds || !orderedPropertyIds) {
      return;
    }

    if (areEqual(propertyIds, orderedPropertyIds)) {
      return;
    }

    reorderPropertiesMutate({
      variables: {
        input: {
          languageId: selectedLanguageId,
          partOfSpeech: selectedPartOfSpeech,
          propertyIds: orderedPropertyIds,
        },
      },
    });
  }, [
    selectedLanguageId,
    selectedPartOfSpeech,
    orderedPropertyIds,
    properties,
    reorderPropertiesMutate,
  ]);

  const handleCreateNewRef = useCallback((node: HTMLDivElement | null) => {
    node?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCreateNew = useCallback(() => {
    setIsNewPropertyOpen(true);
    setSelectedPropertyId(null);
  }, []);

  const handlePropertyCreated = useCallback(() => {
    setIsNewPropertyOpen(false);
    setSelectedPropertyId(null);
  }, []);

  const handleReorderPropertiesPreview = useCallback(
    (property1Id: string, property2Id: string) => {
      const property1Index = orderedPropertyIds.indexOf(property1Id);
      const property2Index = orderedPropertyIds.indexOf(property2Id);

      const reorderedPropertyIds = [...orderedPropertyIds];
      reorderedPropertyIds[property1Index] = property2Id;
      reorderedPropertyIds[property2Index] = property1Id;

      setOrderedPropertyIds(reorderedPropertyIds);
    },
    [orderedPropertyIds],
  );

  useEffect(() => {
    if (selectedLanguageId) {
      fetchProperties({
        variables: {
          languageId: selectedLanguageId,
          partOfSpeech: selectedPartOfSpeech,
        },
      });
    }
  }, [selectedLanguageId, selectedPartOfSpeech, fetchProperties]);

  useEffect(() => {
    setIsNewPropertyOpen(false);
    setSelectedPropertyId(null);
  }, [selectedLanguageId, selectedPartOfSpeech]);

  useEffect(() => {
    if (properties) {
      setOrderedPropertyIds(properties.map((property) => property.id));
    }
  }, [properties]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <div className={styles.list}>
          {orderedProperties?.map((property) => (
            <PropertyListItem
              key={property.id}
              partOfSpeech={selectedPartOfSpeech}
              property={property}
              selected={property.id === selectedPropertyId}
              onSelect={() => setSelectedPropertyId(property.id)}
              onReorderPreview={handleReorderPropertiesPreview}
              onReorder={reorderProperties}
            />
          ))}

          {isNewPropertyOpen ? (
            <div key="new" ref={handleCreateNewRef}>
              <PropertyListItem
                partOfSpeech={selectedPartOfSpeech}
                property={null}
                selected={!selectedPropertyId}
                onSelect={() => setSelectedPropertyId(null)}
                onPropertyCreated={handlePropertyCreated}
                onReorderPreview={handleReorderPropertiesPreview}
                onReorder={reorderProperties}
              />
            </div>
          ) : (
            <div key="end" className={styles.listEnd} />
          )}
        </div>

        <PropertyListItemOverlay />

        {!isNewPropertyOpen && (
          <div className={styles.buttons}>
            <div className={styles.buttonWrapper}>
              <ButtonIcon
                icon={TbHexagonPlusFilled}
                type="primary"
                onClick={handleCreateNew}
              />
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};
