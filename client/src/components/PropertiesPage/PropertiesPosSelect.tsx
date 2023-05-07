import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';
import { IoSquare } from 'solid-icons/io';
import { BsDiamondFill } from 'solid-icons/bs';
import { BsHexagonFill } from 'solid-icons/bs';
import { FaSolidStar } from 'solid-icons/fa';
import { BsTriangleFill } from 'solid-icons/bs';
import { FaSolidCircle } from 'solid-icons/fa';
import { PartOfSpeech } from '../../api/types/graphql';

export type PropertiesPosSelectProps = {
  selectedPos: PartOfSpeech;
  setSelectedPos: (selectedProperty: PartOfSpeech) => void;
};

type PartOfSpeechButtonProps = {
  label: string;
  icon: IconTypes;
};

export const partOfSpeechParams: Record<PartOfSpeech, PartOfSpeechButtonProps> =
  {
    [PartOfSpeech.Noun]: {
      label: 'Noun',
      icon: IoSquare,
    },
    [PartOfSpeech.Verb]: {
      label: 'Verb',
      icon: BsTriangleFill,
    },
    [PartOfSpeech.Adj]: {
      label: 'Adj',
      icon: FaSolidCircle,
    },
    [PartOfSpeech.Adv]: {
      label: 'Adv',
      icon: BsHexagonFill,
    },
    [PartOfSpeech.Pron]: {
      label: 'Pron',
      icon: BsDiamondFill,
    },
    [PartOfSpeech.Misc]: {
      label: 'Misc',
      icon: FaSolidStar,
    },
  };

const PropertiesPosSelect: Component<PropertiesPosSelectProps> = (props) => {
  return (
    <div class="my-2 flex flex-row justify-center bg-lavender text-spacecadet font-bold cursor-pointer">
      {Object.entries(partOfSpeechParams).map(([partOfSpeech, posProps]) => (
        <div
          class="p-2 items-center flex flex-row hover:bg-spacecadet hover:text-lavender"
          classList={{
            'bg-spacecadet text-lavender': partOfSpeech === props.selectedPos,
          }}
          onClick={() => props.setSelectedPos(partOfSpeech as PartOfSpeech)}
        >
          <div>
            <posProps.icon size="1rem" class="m-1" />
          </div>
          <div class="hidden md:block">{posProps.label}</div>
        </div>
      ))}
    </div>
  );
};

export default PropertiesPosSelect;
