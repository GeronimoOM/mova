import { ExerciseCard } from './ExerciseCard';
import { ExerciseProgress } from './ExerciseProgress';
import * as styles from './ExercisesPage.css';

export const ExercisesPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <ExerciseProgress />
      <ExerciseCard />
    </div>
  );
};
