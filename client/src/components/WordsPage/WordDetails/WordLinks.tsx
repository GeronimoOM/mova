import classNames from 'classnames';
import { IconType } from 'react-icons';
import {
  GetWordsDocument,
  LinkedWordFieldsFragment,
  WordLinkType,
} from '../../../api/types/graphql';

import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import {
  TbArrowsDiff,
  TbArrowsJoin2,
  TbExternalLink,
  TbLinkOff,
  TbLinkPlus,
} from 'react-icons/tb';
import { MIN_QUERY_LENGTH } from '../../../utils/constants';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Dropdown } from '../../common/Dropdown';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import { useLanguageContext } from '../../LanguageContext';
import { LinkedWordChange, Word } from './useWordDetails';
import * as styles from './WordLinks.css';

const WORDS_SEARCH_SIZE = 10;
const SEARCH_DELAY_MS = 300;

const linkTypeToIcon: Record<WordLinkType, IconType> = {
  [WordLinkType.Similar]: TbArrowsJoin2,
  [WordLinkType.Distinct]: TbArrowsDiff,
};

const linkTypeToLabel: Record<WordLinkType, string> = {
  [WordLinkType.Similar]: 'words.similar.label',
  [WordLinkType.Distinct]: 'words.distinct.label',
};

const linkTypeToSearchPlaceholder: Record<WordLinkType, string> = {
  [WordLinkType.Similar]: 'words.similar.search',
  [WordLinkType.Distinct]: 'words.distinct.search',
};

type LinkAction = 'add' | 'delete' | 'open';
const linkActionToIcon: Record<LinkAction, IconType> = {
  add: TbLinkPlus,
  delete: TbLinkOff,
  open: TbExternalLink,
};

export type WordLinksProps = {
  word: Word;
  type: WordLinkType;
  links: LinkedWordChange[];
  onOpenLink: (wordId: string) => void;
  onAddLink: (link: LinkedWordFieldsFragment) => void;
  onDeleteLink: (link: LinkedWordFieldsFragment) => void;
};

export const WordLinks = ({
  word,
  type,
  links,
  onAddLink,
  onDeleteLink,
  onOpenLink,
}: WordLinksProps) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const addBtnRef = useRef<HTMLDivElement>(null);

  const handleOpenLink = (id: string) => {
    onOpenLink(id);
    setDropdownOpen(false);
  };

  return (
    <div
      className={styles.wrapper}
      data-testid={`word-details-link-${type.toLowerCase()}`}
    >
      <Dropdown
        isOpen={isDropdownOpen}
        onCloseOutside={() => setDropdownOpen(false)}
        closeOutsideRef={addBtnRef}
        content={
          <WordLinksDropdown
            word={word}
            type={type}
            links={links}
            onOpenLink={handleOpenLink}
            onAddLink={onAddLink}
          />
        }
        alignment="stretch"
        outline="bold"
      >
        <div className={styles.labelRow}>
          <Icon icon={linkTypeToIcon[type]} />
          <div>{t(linkTypeToLabel[type])}</div>

          <div ref={addBtnRef}>
            <ButtonIcon
              icon={TbLinkPlus}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              size={'small'}
              dataTestId="word-links-btn"
            />
          </div>
        </div>
      </Dropdown>

      <div className={styles.list}>
        {links.map((link) => (
          <WordLink
            key={link.id}
            link={link}
            onLinkClick={() => handleOpenLink(link.id)}
            action={link.isDeleted ? 'add' : 'delete'}
            onAction={() =>
              link.isDeleted ? onAddLink(link) : onDeleteLink(link)
            }
          />
        ))}
      </div>
    </div>
  );
};

type WordLinkProps = {
  link: LinkedWordChange;
  onLinkClick: () => void;
  action: LinkAction;
  onAction: () => void;
};

const WordLink = ({ link, action, onLinkClick, onAction }: WordLinkProps) => {
  return (
    <div
      className={classNames(styles.listItem, { deleted: link.isDeleted })}
      onClick={() => onLinkClick()}
      data-testid="word-link"
    >
      <div className={styles.listItemOriginal}>{link.original}</div>
      <div className={styles.listItemTranslation}>{link.translation}</div>
      <div className={styles.listItemUnlinkBtn}>
        <ButtonIcon
          icon={linkActionToIcon[action]}
          onClick={onAction}
          size={'small'}
          dataTestId={'word-link-btn'}
        />
      </div>
    </div>
  );
};

type WordLinksDropdownProps = {
  word: Word;
  type: WordLinkType;
  links: LinkedWordFieldsFragment[];
  onOpenLink: (id: string) => void;
  onAddLink: (link: LinkedWordFieldsFragment) => void;
};

const WordLinksDropdown = ({
  word,
  type,
  links,
  onOpenLink,
  onAddLink,
}: WordLinksDropdownProps) => {
  const [selectedLanguageId] = useLanguageContext();
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const [fetchWords, { data: wordsQuery }] = useLazyQuery(GetWordsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [fetchSuggestions, { data: suggestionsQuery }] = useLazyQuery(
    GetWordsDocument,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const debouncedQuery = useDebouncedValue(query, SEARCH_DELAY_MS);

  const filterWords = useCallback(
    (words?: LinkedWordFieldsFragment[]) =>
      words?.filter(
        (w) => w.id !== word.id && !links.some((link) => w.id === link.id),
      ),
    [links, word.id],
  );

  const isSearch = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const words = isSearch ? filterWords(wordsQuery?.language?.words.items) : [];
  const suggestionsSearchQuery =
    type === WordLinkType.Similar ? word.translation : word.original;
  const isSuggestionsSearch =
    suggestionsSearchQuery && suggestionsSearchQuery.length >= MIN_QUERY_LENGTH;
  const suggestions = isSuggestionsSearch
    ? filterWords(suggestionsQuery?.language?.words.items)
    : [];

  const searchWords = useCallback(() => {
    if (!selectedLanguageId || !isSearch) {
      return;
    }

    fetchWords({
      variables: {
        languageId: selectedLanguageId,
        limit: WORDS_SEARCH_SIZE,
        query: debouncedQuery,
        partsOfSpeech: [word.partOfSpeech!],
      },
    });
  }, [
    selectedLanguageId,
    debouncedQuery,
    isSearch,
    fetchWords,
    word.partOfSpeech,
  ]);

  const searchSuggestions = useCallback(() => {
    if (!selectedLanguageId || !isSuggestionsSearch) {
      return;
    }

    fetchSuggestions({
      variables: {
        languageId: selectedLanguageId,
        limit: WORDS_SEARCH_SIZE,
        query: suggestionsSearchQuery,
        partsOfSpeech: [word.partOfSpeech!],
      },
    });
  }, [
    selectedLanguageId,
    fetchSuggestions,
    isSuggestionsSearch,
    suggestionsSearchQuery,
    word.partOfSpeech,
  ]);

  useEffect(() => {
    searchWords();
  }, [searchWords]);

  useEffect(() => {
    searchSuggestions();
  }, [searchSuggestions]);

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownSearch}>
        <Input
          value={query}
          onChange={setQuery}
          text="original"
          placeholder={t(linkTypeToSearchPlaceholder[type])}
          left={<Icon icon={PiMagnifyingGlassBold} />}
          dataTestId="word-links-search"
        />
      </div>

      <div className={styles.list}>
        {!isSearch && Boolean(suggestions?.length) && (
          <div className={styles.dropdownSuggestionsLabel}>
            {t('words.suggestions')}
          </div>
        )}
        {(isSearch ? words : suggestions)?.map((link) => (
          <WordLink
            key={link.id}
            link={link}
            onLinkClick={() => onAddLink(link)}
            action={'open'}
            onAction={() => onOpenLink(link.id)}
          />
        ))}
      </div>
    </div>
  );
};
