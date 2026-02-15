import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { PartOfSpeech } from '../../api/types/graphql';
import {
  partOfSpeechToFullLabel,
  partOfSpeechToShortLabel,
} from '../../utils/partsOfSpeech';
import * as styles from './PartOfSpeechPill.css';

export type PartOfSpeechPillProps = {
  partOfSpeech: PartOfSpeech;
  disabled?: boolean;
  active?: boolean;
  full?: boolean;
};

export const PartOfSpeechPill = ({
  partOfSpeech,
  disabled,
  active,
  full,
}: PartOfSpeechPillProps) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.pill({ disabled }), { active })}>
      {t(
        full
          ? partOfSpeechToFullLabel[partOfSpeech]
          : partOfSpeechToShortLabel[partOfSpeech],
      )}
    </div>
  );
};
