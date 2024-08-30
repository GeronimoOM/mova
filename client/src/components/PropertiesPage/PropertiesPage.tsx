import React, { useState } from 'react';
import { PartOfSpeech } from '../../api/types/graphql';
import { PropertiesList } from './PropertiesList';
import * as styles from './PropertiesPage.css';
import { PropertiesPartsOfSpeech } from './PropertiesPartsOfSpeech';

export const PropertiesPage: React.FC = () => {
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] =
    useState<PartOfSpeech>(PartOfSpeech.Noun);

  return (
    <div className={styles.wrapper}>
      <PropertiesPartsOfSpeech
        selectedPartOfSpeech={selectedPartOfSpeech}
        onSelectPartOfSpeech={setSelectedPartOfSpeech}
      />
      <PropertiesList selectedPartOfSpeech={selectedPartOfSpeech} />
    </div>
  );
};
