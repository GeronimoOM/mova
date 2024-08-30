import { useQuery } from '@apollo/client';
import { GetLanguagesDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';

import { useCallback, useState } from 'react';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { ButtonIcon } from '../common/ButtonIcon';
import { LanguageCard } from './LanguageCard';
import * as styles from './LanguagesPage.css';

export const LanguagesPage: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useLanguageContext();
  const [isNewLanguageOpen, setIsNewLanguageOpen] = useState(false);

  const { data: languagesQuery } = useQuery(GetLanguagesDocument);
  const languages = languagesQuery?.languages;

  const handleCreateNewRef = useCallback((node: HTMLDivElement | null) => {
    node?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCreateNew = useCallback(() => {
    setIsNewLanguageOpen(true);
  }, []);

  const handleLanguageSelect = useCallback(
    (languageId: string) => {
      setSelectedLanguageId(languageId);
    },
    [setSelectedLanguageId],
  );

  const handleLanguageCreated = useCallback(() => {
    setIsNewLanguageOpen(false);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {languages?.map((language) => (
          <LanguageCard
            key={language.id}
            language={language}
            selected={selectedLanguageId === language.id}
            onSelect={handleLanguageSelect}
            onLanguageCreated={handleLanguageCreated}
          />
        ))}

        {isNewLanguageOpen ? (
          <div key="new" ref={handleCreateNewRef}>
            <LanguageCard
              language={null}
              selected={false}
              onSelect={handleLanguageSelect}
              onLanguageCreated={handleLanguageCreated}
            />
          </div>
        ) : (
          <div key="end" className={styles.listEnd} />
        )}
      </div>

      {!isNewLanguageOpen && (
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
  );
};
