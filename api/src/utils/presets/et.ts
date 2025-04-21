import { PartOfSpeech } from 'models/Word';

export const name = 'Eesti';

export const properties: Record<PartOfSpeech, string[]> = {
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
};
