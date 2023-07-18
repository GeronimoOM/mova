import { IconTypes } from 'solid-icons';
import { BsTriangleFill, BsHexagonFill, BsDiamondFill } from 'solid-icons/bs';
import { FaSolidCircle, FaSolidStar } from 'solid-icons/fa';
import { IoSquare } from 'solid-icons/io';
import { PartOfSpeech } from '../../api/types/graphql';

type PartOfSpeechProps = {
  labelShort: string;
  label: string;
  icon: IconTypes;
};

export const partsOfSpeechParams: Record<PartOfSpeech, PartOfSpeechProps> = {
  [PartOfSpeech.Noun]: {
    labelShort: 'Noun',
    label: 'Noun',
    icon: IoSquare,
  },
  [PartOfSpeech.Verb]: {
    labelShort: 'Verb',
    label: 'Verb',
    icon: BsTriangleFill,
  },
  [PartOfSpeech.Adj]: {
    labelShort: 'Adj',
    label: 'Adjective',
    icon: FaSolidCircle,
  },
  [PartOfSpeech.Adv]: {
    labelShort: 'Adv',
    label: 'Adverb',
    icon: BsHexagonFill,
  },
  [PartOfSpeech.Pron]: {
    labelShort: 'Pron',
    label: 'Pronoun',
    icon: BsDiamondFill,
  },
  [PartOfSpeech.Misc]: {
    labelShort: 'Misc',
    label: 'Miscellaneous',
    icon: FaSolidStar,
  },
};

export const partsOfSpeech: PartOfSpeech[] = Object.keys(
  partsOfSpeechParams,
).map((pos) => pos as PartOfSpeech);
