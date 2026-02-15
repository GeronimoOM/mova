import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { v1 as uuid } from 'uuid';
import { PartOfSpeech } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './PropertiesList.css';
import { PropertyListItem, PropertyListItemOverlay } from './PropertyListItem';
import { useOrderedProperties } from './reorderProperties';

export type PropertiesListProps = {
  selectedPartOfSpeech: PartOfSpeech;
};

export const PropertiesList = ({
  selectedPartOfSpeech,
}: PropertiesListProps) => {
  const [selectedLanguageId] = useLanguageContext();
  const ref = useRef<HTMLDivElement>(null);

  const { orderedProperties, swapPropertiesPreview, reorderProperties } =
    useOrderedProperties(selectedLanguageId, selectedPartOfSpeech);

  const [newPropertyId, setNewPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const isNewPropertyOpen = useMemo(
    () =>
      !!newPropertyId &&
      !orderedProperties?.find((prop) => prop.id === newPropertyId),
    [newPropertyId, orderedProperties],
  );

  useEffect(() => {
    setNewPropertyId(null);
    setSelectedPropertyId(null);
  }, [selectedLanguageId, selectedPartOfSpeech]);

  const handleOpenNew = useCallback(() => {
    const newPropertyId = uuid();
    setNewPropertyId(newPropertyId);
    setSelectedPropertyId(newPropertyId);
  }, []);

  const handlePropertyCreated = useCallback(() => {
    setNewPropertyId(null);
  }, []);

  useEffect(() => {
    if (isNewPropertyOpen) {
      ref?.current?.scroll({
        behavior: 'smooth',
        top: Number.MAX_SAFE_INTEGER,
      });
    }
  }, [isNewPropertyOpen]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <div className={styles.list} ref={ref}>
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

          {isNewPropertyOpen && (
            <PropertyListItem
              key={newPropertyId}
              partOfSpeech={selectedPartOfSpeech}
              property={null}
              newPropertyId={newPropertyId!}
              selected={
                !!selectedPropertyId && newPropertyId === selectedPropertyId
              }
              onSelect={() => setSelectedPropertyId(newPropertyId)}
              onSwapPreview={swapPropertiesPreview}
              onReorder={reorderProperties}
              onPropertyCreated={handlePropertyCreated}
            />
          )}

          <div key="end" className={styles.listEnd} />
        </div>

        <PropertyListItemOverlay />

        {!isNewPropertyOpen && (
          <div className={styles.buttons}>
            <ButtonIcon
              icon={TbHexagonPlusFilled}
              color="primary"
              highlighted={true}
              onClick={handleOpenNew}
              wrapped
              dataTestId="properties-create-btn"
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};
