import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { PartOfSpeech } from '../../api/types/graphql';
import { partOfSpeechToShortLabel } from '../../utils/partsOfSpeech';
import * as styles from './PartOfSpeechPill.css';

export type PartOfSpeechPillProps = {
  partOfSpeech: PartOfSpeech;
  disabled?: boolean;
  active?: boolean;
};

export const PartOfSpeechPill = ({
  partOfSpeech,
  disabled,
  active,
}: PartOfSpeechPillProps) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.pill({ disabled }), { active })}>
      {t(partOfSpeechToShortLabel[partOfSpeech])}
    </div>
  );
};
