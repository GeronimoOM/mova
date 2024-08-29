import classNames from 'classnames';
import React, { ComponentType, useState } from 'react';
import { IconType } from 'react-icons';
import { BsFillBarChartFill } from 'react-icons/bs';
import { FaChartPie } from 'react-icons/fa6';
import { TbTargetArrow } from 'react-icons/tb';
import { Icon } from '../common/Icon';
import { GoalsTab } from './GoalsTab';
import { ProgressTab } from './ProgressTab';
import { StatsTab } from './StatsTab';

import * as styles from './ProgressPage.css';

export enum ProgressPageTab {
  Progress = 'progress',
  Stats = 'stats',
  Goals = 'goals',
}

const tabs: Record<
  ProgressPageTab,
  {
    label: string;
    icon: IconType;
    content: ComponentType;
  }
> = {
  [ProgressPageTab.Progress]: {
    label: 'Progress',
    icon: BsFillBarChartFill,
    content: ProgressTab,
  },
  [ProgressPageTab.Goals]: {
    label: 'Goals',
    icon: TbTargetArrow,
    content: GoalsTab,
  },
  [ProgressPageTab.Stats]: {
    label: 'Stats',
    icon: FaChartPie,
    content: StatsTab,
  },
};

export const ProgressPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ProgressPageTab>(
    ProgressPageTab.Progress,
  );

  const TabContent = tabs[selectedTab].content;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {Object.entries(tabs).map(([tab, { label, icon }]) => (
          <div
            key={tab}
            className={classNames(styles.tab, {
              active: selectedTab === tab,
            })}
            onClick={() => setSelectedTab(tab as ProgressPageTab)}
          >
            <Icon icon={icon} />
            <div>{label}</div>
          </div>
        ))}
      </div>

      <TabContent />
    </div>
  );
};