import { useQuery } from '@apollo/client';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { BsEraserFill } from 'react-icons/bs';
import { FaFeatherPointed } from 'react-icons/fa6';
import { useSetGoals } from '../../api/mutations';
import {
  GetGoalsDocument,
  Goal,
  GoalFieldsFragment,
  ProgressCadence,
  ProgressType,
} from '../../api/types/graphql';
import { toRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import * as styles from './GoalsTab.css';
import {
  ProgressCadences,
  ProgressTypes,
  progressTypeToColor,
  progressTypeToIcon,
} from './progress';

const MAX_POINTS = 1000;

export const GoalsTab: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();
  const [goals, setGoals] = useState<Goal[] | null>(null);

  const { data: goalsQuery } = useQuery(GetGoalsDocument, {
    variables: { languageId: selectedLanguageId! },
  });
  const [setGoalsMutate, { loading: goalsSetting }] = useSetGoals();
  const currentGoals = goalsQuery?.language?.goals;

  const goalByType = useMemo(
    () => (goals ? toRecord(goals, (goal) => goal.type) : undefined),
    [goals],
  );
  const canSetGoals = Boolean(
    currentGoals &&
      goals &&
      currentGoals.some((currentGoal, i) => {
        const goal = goals[i];
        return (
          currentGoal.cadence !== goal.cadence ||
          currentGoal.points !== goal.points
        );
      }),
  );

  useEffect(() => {
    if (currentGoals) {
      setGoals(currentGoals.map((goal) => ({ ...goal })));
    }
  }, [currentGoals]);

  const handleGoalChange = (goal: GoalFieldsFragment) => {
    setGoals(goals?.map((g) => (g.type === goal.type ? goal : g)) ?? null);
  };

  const handleResetGoals = () => {
    setGoals(currentGoals?.map((goal) => ({ ...goal })) ?? null);
  };

  const handleSetGoals = () => {
    if (!canSetGoals) {
      return;
    }

    setGoalsMutate({
      variables: {
        input: {
          languageId: selectedLanguageId!,
          goals: goals!.map((goal) => ({
            type: goal.type,
            cadence: goal.cadence,
            points: goal.points,
          })),
        },
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      {ProgressTypes.map((type) => (
        <ProgressGoal
          key={type}
          type={type}
          goal={goalByType?.[type] ?? null}
          onGoalChange={handleGoalChange}
        />
      ))}

      <div key="buttons" className={styles.buttons}>
        <ButtonIcon
          icon={FaFeatherPointed}
          color="primary"
          highlighted={true}
          onClick={handleSetGoals}
          disabled={!canSetGoals}
          loading={goalsSetting}
        />

        <ButtonIcon
          icon={BsEraserFill}
          onClick={handleResetGoals}
          disabled={!canSetGoals}
        />
      </div>
    </div>
  );
};

type ProgressGoalProps = {
  type: ProgressType;
  goal: GoalFieldsFragment | null;
  onGoalChange: (goal: GoalFieldsFragment) => void;
};

const ProgressGoal: React.FC<ProgressGoalProps> = ({
  type,
  goal,
  onGoalChange,
}) => {
  const color = progressTypeToColor[type];
  const icon = progressTypeToIcon[type];

  const handleCadenceChange = (cadence: ProgressCadence) => {
    if (!goal) {
      return;
    }

    onGoalChange({ ...goal, cadence });
  };

  const handlePointsChange = (value: string) => {
    if (!goal) {
      return;
    }

    const number = value === '' ? 0 : Number(value);

    if (isNaN(number) || number < 0 || number > MAX_POINTS) {
      return;
    }

    onGoalChange({ ...goal, points: Number(value) });
  };

  return (
    <div className={styles.goal}>
      <div className={styles.goalIcon({ color })}>
        <Icon icon={icon} />
      </div>

      <div className={styles.goalCadences}>
        {ProgressCadences.map((cadence) => (
          <div
            className={classNames(styles.goalCadence({ color }), {
              selected: goal?.cadence === cadence,
            })}
            key={cadence}
            onClick={() => handleCadenceChange(cadence)}
          >
            {cadence}
          </div>
        ))}
      </div>

      <div className={styles.goalInput}>
        <Input
          text="translation"
          textColor={color}
          value={String(goal?.points ?? '0')}
          onChange={handlePointsChange}
          disabled={!goal}
        />
      </div>
    </div>
  );
};
