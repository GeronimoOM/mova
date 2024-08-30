import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { PartOfSpeech } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './PropertiesList.css';
import { PropertyListItem, PropertyListItemOverlay } from './PropertyListItem';
import { useOrderedProperties } from './reorderProperties';

export type PropertiesListProps = {
  selectedPartOfSpeech: PartOfSpeech;
};

export const PropertiesList: React.FC<PropertiesListProps> = ({
  selectedPartOfSpeech,
}) => {
  const [selectedLanguageId] = useLanguageContext();

  const { orderedProperties, swapPropertiesPreview, reorderProperties } =
    useOrderedProperties(selectedLanguageId, selectedPartOfSpeech);

  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    setIsNewPropertyOpen(false);
    setSelectedPropertyId(null);
  }, [selectedLanguageId, selectedPartOfSpeech]);

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
              onSwapPreview={swapPropertiesPreview}
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
                onSwapPreview={swapPropertiesPreview}
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
            <ButtonIcon
              icon={TbHexagonPlusFilled}
              color="primary"
              highlighted={true}
              onClick={handleCreateNew}
              wrapped
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};
