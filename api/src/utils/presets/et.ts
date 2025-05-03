import { Color } from 'models/Color';
import { PropertyType } from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { PresetConfig } from '.';

export const etConfig: PresetConfig = {
  name: 'Eesti',
  properties: {
    [PartOfSpeech.Noun]: [
      'ainsuse omastav',
      'ainsuse osastav',
      'mitmuse omastav',
      'mitmuse osastav',
      'lühike sisseütlev',
    ],
    [PartOfSpeech.Verb]: [
      'da-tegevusnimi',
      'oleviku ainsuse 3. isik',
      'lihtmineviku ainsuse 3. isik',
      'tud-kesksõna',
      {
        name: 'rektsioon',
        type: PropertyType.Option,
        options: [
          {
            value: 'keda/mida',
            color: Color.Blue,
          },
          {
            value: 'kellest/millest',
            color: Color.Green,
          },
          {
            value: 'kellega/millega',
            color: Color.Teal,
          },
          {
            value: 'kuhu',
            color: Color.Orange,
          },
          {
            value: 'kus',
            color: Color.Yellow,
          },
          {
            value: 'et',
            color: Color.Brown,
          },
        ],
      },
    ],
    [PartOfSpeech.Adj]: [
      'ainsuse omastav',
      'ainsuse osastav',
      'mitmuse omastav',
      'mitmuse osastav',
      'keskvõrre',
      'ülivõrre',
    ],
    [PartOfSpeech.Adv]: ['keskvõrre', 'ülivõrre'],
    [PartOfSpeech.Pron]: [
      'ainsuse omastav',
      'ainsuse osastav',
      'mitmuse omastav',
      'mitmuse osastav',
    ],
    [PartOfSpeech.Misc]: ['sisseütlev / alaleütlev', 'seestütlev / alaltütlev'],
  },
};
