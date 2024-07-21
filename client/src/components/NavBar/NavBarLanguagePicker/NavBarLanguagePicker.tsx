import { useQuery } from '@apollo/client';
import React from 'react';
import { FaEarthEurope } from 'react-icons/fa6';
import {
  useCreateLanguage,
  useDeleteLanguage,
  useUpdateLanguage,
} from '../../../api/mutations';
import { GetLanguagesDocument } from '../../../api/types/graphql';
import { useLanguageContext } from '../../LanguageContext';
import { Icon } from '../../common/Icon';

export const NavBarLanguagePicker: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useLanguageContext();

  const { data: languagesQuery } = useQuery(GetLanguagesDocument);
  const languages = languagesQuery?.languages;
  const selectedLanguage = languages?.find(
    (language) => language.id === selectedLanguageId,
  );

  const [createLanguage] = useCreateLanguage();
  const [updateLanguage] = useUpdateLanguage();
  const [deleteLanguage] = useDeleteLanguage();

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguageId(languageId);
  };

  return (
    <div>
      <Icon icon={FaEarthEurope} />
      {/* {selectedLanguage?.name ?? 'Language'}

      {languages?.map((language) => (
        <div
          key={language.id}
          onClick={() => handleLanguageSelect(language.id)}
        >
          {language.name}
        </div>
      ))} */}
    </div>
  );
};
