import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DISPLAY_DATE_TIME_FORMAT } from '../../../utils/constants';
import { fromTimestamp } from '../../../utils/datetime';
import { Locale } from '../../../utils/translator';
import { Dropdown } from '../../common/Dropdown';
import { useUserContext } from '../../UserContext';
import * as styles from './WordMastery.css';

import { DateTime } from 'luxon';
import { IconType } from 'react-icons';
import { FaUndoAlt } from 'react-icons/fa';
import { PiStar, PiStarFill, PiStarHalfFill } from 'react-icons/pi';
import { useResetConfidence } from '../../../api/mutations';
import { AccentColor, ThemeColor } from '../../../index.css';
import {
  Confidence,
  confidenceToColor,
  confidenceToLabel,
  MaxConfidence,
} from '../../../utils/confidence';
import {
  Mastery,
  masteryToColor,
  masteryToLabel,
  MaxMastery,
} from '../../../utils/mastery';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';

type WordMasteryProps = {
  wordId: string | null;
  mastery: Mastery;
  confidence: Confidence;
  nextExerciseAt: string | null;
};

const positiveConfidenceToBorderType: Partial<
  Record<Confidence, 'dotted' | 'dashed' | 'solid'>
> = {
  1: 'dotted',
  2: 'dashed',
  3: 'solid',
} as const;

const getLevelIcon = (
  mastery: Mastery,
  confidence: Confidence,
  level: number,
): IconType => {
  if (level !== mastery) {
    return PiStarFill;
  } else if (confidence === -2) {
    return PiStar;
  } else if (confidence === -1) {
    return PiStarHalfFill;
  } else {
    return PiStarFill;
  }
};

const getLevelColor = (
  mastery: Mastery,
  level: number,
): ThemeColor | AccentColor =>
  level > mastery ? 'backgroundLighter' : 'secondary1';

export const WordMastery = ({
  wordId,
  mastery,
  confidence,
  nextExerciseAt,
}: WordMasteryProps) => {
  const [isOpen, setOpen] = useState(false);
  const handleOpen = (isOpen: boolean) => {
    if (!wordId) {
      return;
    }

    setOpen(isOpen);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={handleOpen}
      content={
        <WordMasteryTooltip
          wordId={wordId}
          mastery={mastery}
          confidence={confidence}
          nextExerciseAt={nextExerciseAt}
        />
      }
      position="bottom"
    >
      <div
        className={styles.mastery({
          disabled: !wordId,
          ...(mastery === MaxMastery && {
            border: positiveConfidenceToBorderType[confidence],
          }),
        })}
      >
        {[1, 2, 3].map((level) => (
          <Icon
            key={level}
            icon={getLevelIcon(mastery, confidence, level)}
            color={getLevelColor(mastery, level)}
          />
        ))}
      </div>
    </Dropdown>
  );
};

const WordMasteryTooltip = ({
  wordId,
  mastery,
  confidence,
  nextExerciseAt,
}: WordMasteryProps) => {
  const { settings } = useUserContext();
  const locale = settings.selectedLocale as Locale;
  const { t } = useTranslation();
  const [resetConfidence] = useResetConfidence();

  const nextExerciseAtDate = fromTimestamp(nextExerciseAt)!;
  const nextExerciseAtValue = nextExerciseAtDate
    .setZone('local')
    .setLocale(locale)
    .toFormat(DISPLAY_DATE_TIME_FORMAT);
  const isNextExerciseReady = nextExerciseAtDate < DateTime.utc();
  const isMastered = mastery === MaxMastery && confidence === MaxConfidence;

  const handleResetConfidenceClick = () => {
    resetConfidence({
      variables: {
        wordId: wordId!,
      },
    });
  };

  return (
    <div className={styles.tooltip}>
      <div>{t('mastery.label')}</div>
      <div
        className={styles.tooltipValue}
        style={{
          color: masteryToColor[mastery],
        }}
      >
        {t(masteryToLabel[mastery])}
      </div>

      <div>{t('confidence.label')}</div>
      <div
        className={styles.tooltipValue}
        style={{
          color: confidenceToColor[confidence],
        }}
      >
        {t(confidenceToLabel[confidence])}
      </div>

      <div>{t('words.mastery.nextExerciseAt')}</div>
      <div
        className={styles.tooltipValue}
        style={{
          ...(isNextExerciseReady && { color: masteryToColor[MaxMastery] }),
        }}
      >
        {isMastered
          ? '—'
          : isNextExerciseReady
            ? t('words.mastery.exerciseReady')
            : nextExerciseAtValue}
      </div>
      {isMastered && (
        <div className={styles.resetButton}>
          <ButtonIcon icon={FaUndoAlt} onClick={handleResetConfidenceClick} />
        </div>
      )}
    </div>
  );
};
