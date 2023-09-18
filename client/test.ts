import { DateTime } from 'luxon';

const DATE_FORMAT = 'yyyy-LL-dd';

const date1 = DateTime.fromFormat('2023-09-07', DATE_FORMAT);
const date2 = DateTime.fromFormat('2023-12-01', DATE_FORMAT);
console.log(date2.diff(date1, 'days').days);
console.log(DateTime.now().weekday);

