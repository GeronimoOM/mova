import React from 'react';
import { TbRectangle, TbRectangleFilled } from 'react-icons/tb';

import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { breakpoints } from '../../../index.css';
import { DISPLAY_DATE_TIME_FORMAT } from '../../../utils/constants';
import { fromTimestamp } from '../../../utils/datetime';
import { useMediaQuery } from '../../../utils/useMediaQuery';
import { useLocaleContext } from '../../LocaleContext';
import { Icon } from '../../common/Icon';
import { Tooltip } from '../../common/Tooltip';
import * as styles from './WordMastery.css';

const MAX_PROGRESS = 3;

type WordMasteryProps = {
  mastery: number;
  nextExerciseAt: string | null;
};

export const WordMastery: React.FC<WordMasteryProps> = ({
  mastery,
  nextExerciseAt,
}) => {
  const isSmall = useMediaQuery(breakpoints.small);

  return (
    <Tooltip
      content={<WordMasteryTooltip nextExerciseAt={nextExerciseAt} />}
      side={isSmall ? 'left' : 'bottomLeft'}
    >
      <div className={styles.mastery}>
        {Array(MAX_PROGRESS)
          .fill(null)
          .map((_, index) =>
            mastery > index ? (
              <Icon key={index} icon={TbRectangleFilled} />
            ) : (
              <Icon key={index} icon={TbRectangle} />
            ),
          )}
      </div>
    </Tooltip>
  );
};

const WordMasteryTooltip: React.FC<
  Pick<WordMasteryProps, 'nextExerciseAt'>
> = ({ nextExerciseAt }) => {
  const [locale] = useLocaleContext();
  const { t } = useTranslation();

  let tooltip: string;
  let formattedNextExerciseAt: string | null = null;
  if (nextExerciseAt) {
    const nextExerciseAtDate = fromTimestamp(nextExerciseAt)!;
    if (nextExerciseAtDate >= DateTime.utc()) {
      tooltip = t('words.mastery.nextExerciseAt');
      formattedNextExerciseAt = nextExerciseAtDate
        .setZone('local')
        .setLocale(locale)
        .toFormat(DISPLAY_DATE_TIME_FORMAT);
    } else {
      tooltip = t('words.mastery.exerciseReady');
    }
  } else {
    tooltip = t('words.mastery.exerciseReady');
  }

  return (
    <div className={styles.tooltip}>
      <div>{tooltip}</div>
      {formattedNextExerciseAt && (
        <div className={styles.tooltipDate}>{formattedNextExerciseAt}</div>
      )}
    </div>
  );
};
