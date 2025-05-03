import { PartOfSpeech } from '../../api/types/graphql';
import { partsOfSpeech } from '../../utils/partsOfSpeech';
import { PartOfSpeechPill } from '../common/PartOfSpeechPill';
import * as styles from './PropertiesPartsOfSpeech.css';

export type PropertiesPartsOfSpeechProps = {
  selectedPartOfSpeech: PartOfSpeech;
  onSelectPartOfSpeech: (partOfSpeech: PartOfSpeech) => void;
};

export const PropertiesPartsOfSpeech = ({
  selectedPartOfSpeech,
  onSelectPartOfSpeech,
}: PropertiesPartsOfSpeechProps) => {
  return (
    <div className={styles.wrapper}>
      {partsOfSpeech.map((partOfSpeech) => (
        <div
          key={partOfSpeech}
          className={styles.item}
          onClick={() => onSelectPartOfSpeech(partOfSpeech)}
          data-testid={`properties-pos-tab-${partOfSpeech.toLowerCase()}`}
        >
          <PartOfSpeechPill
            partOfSpeech={partOfSpeech}
            active={partOfSpeech === selectedPartOfSpeech}
          />
        </div>
      ))}
    </div>
  );
};
