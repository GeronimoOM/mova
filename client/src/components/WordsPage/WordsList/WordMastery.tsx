import { TbRectangle, TbRectangleFilled } from 'react-icons/tb';

import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hover } from '../../../index.css';
import { DISPLAY_DATE_TIME_FORMAT } from '../../../utils/constants';
import { fromTimestamp } from '../../../utils/datetime';
import { Locale } from '../../../utils/translator';
import { useMediaQuery } from '../../../utils/useMediaQuery';
import { Dropdown } from '../../common/Dropdown';
import { Icon } from '../../common/Icon';
import { useUserContext } from '../../UserContext';
import * as styles from './WordMastery.css';

const MAX_PROGRESS = 3;

type WordMasteryProps = {
  mastery: number;
  nextExerciseAt: string | null;
};

export const WordMastery = ({ mastery, nextExerciseAt }: WordMasteryProps) => {
  const [isOpen, setOpen] = useState(false);
  const canHover = useMediaQuery(hover.enabled);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={setOpen}
      content={<WordMasteryTooltip nextExerciseAt={nextExerciseAt} />}
      alignment={'end'}
    >
      <div
        className={styles.mastery}
        onClick={(e) => canHover && e.stopPropagation()}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
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
    </Dropdown>
  );
};

const WordMasteryTooltip = ({
  nextExerciseAt,
}: Pick<WordMasteryProps, 'nextExerciseAt'>) => {
  const { settings } = useUserContext();
  const locale = settings.selectedLocale as Locale;
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
