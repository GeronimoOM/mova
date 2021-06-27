import React, { FC, useState } from 'react';

import { Language } from '../api/types';
import { getLanguages } from '../api/client';
import { useQuery } from '../api/useQuery';
import { useDispatch } from 'react-redux';
import { useLangSelector } from '../store';
import Select from './utils/Select';
import { select } from '../store/lang';

interface LangSelectDialogProps {
  onClose: () => void;
}

const LangSelectDialog: FC<LangSelectDialogProps> = ({ onClose }) => {
  const initialSelectedLang = useLangSelector();
  const dispatch = useDispatch();

  const [selectedLang, setSelectedLang] = useState(initialSelectedLang);

  const { loading, error, data } = useQuery<Language[]>(() =>
    getLanguages().then((page) => page.items),
  );
  const languages = data ?? [];

  if (error) return <p>Error!</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className='dialog-overlay'>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Select Language</h3>
        <Select
          value={selectedLang}
          onSelect={setSelectedLang}
          options={languages}
          getKey={(lang) => lang.id}
          getLabel={(lang) => lang.name}
        />
        <button
          onClick={() => {
            if (initialSelectedLang?.id !== selectedLang!.id) {
              dispatch(select(selectedLang!));
            }
            onClose();
          }}
          disabled={!selectedLang}
          className='confirm-button'
        >
          OK
        </button>
      </dialog>
    </div>
  );
};

export default LangSelectDialog;
