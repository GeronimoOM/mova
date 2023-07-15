import { IconTypes } from 'solid-icons';
import { BsTriangleFill, BsHexagonFill, BsDiamondFill } from 'solid-icons/bs';
import { FaSolidCircle, FaSolidStar } from 'solid-icons/fa';
import { IoSquare } from 'solid-icons/io';
import { PartOfSpeech } from '../../api/types/graphql';

type PartOfSpeechProps = {
  label: string;
  icon: IconTypes;
};

export const partsOfSpeechParams: Record<PartOfSpeech, PartOfSpeechProps> = {
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

export const partsOfSpeech: PartOfSpeech[] = Object.keys(
  partsOfSpeechParams,
).map((pos) => pos as PartOfSpeech);
