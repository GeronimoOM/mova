import React, { useState } from 'react';
import { BsFillBarChartFill } from 'react-icons/bs';
import { TbTargetArrow } from 'react-icons/tb';
import * as styles from './ProgressPage.css';

import classNames from 'classnames';
import { Icon } from '../common/Icon';
import { ProgressGoals } from './ProgressGoals';
import { ProgressStats } from './ProgressStats';

export enum ProgressTab {
  Progress = 'progress', // TODO progress tab for progress, streak and history
  Stats = 'stats',
  Goals = 'goals',
}

export const ProgressPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ProgressTab>(
    ProgressTab.Stats,
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <div
          className={classNames(styles.tab, {
            active: selectedTab === ProgressTab.Stats,
          })}
          onClick={() => setSelectedTab(ProgressTab.Stats)}
        >
          <Icon icon={BsFillBarChartFill} />
          <div>Stats</div>
        </div>
        <div
          className={classNames(styles.tab, {
            active: selectedTab === ProgressTab.Goals,
          })}
          onClick={() => setSelectedTab(ProgressTab.Goals)}
        >
          <Icon icon={TbTargetArrow} />
          <div>Goals</div>
        </div>
      </div>

      {selectedTab === ProgressTab.Stats ? (
        <ProgressStats />
      ) : (
        <ProgressGoals />
      )}
    </div>
  );
};
