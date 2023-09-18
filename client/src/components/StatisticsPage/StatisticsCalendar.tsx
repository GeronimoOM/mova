import { Component, For, Show } from 'solid-js';
import { DateTime } from 'luxon';
import { Icon } from '../utils/Icon';
import { FaSolidCalendarDays } from 'solid-icons/fa';
import { WordsByDateStats, WordsDateStats } from '../../api/types/graphql';
import { DATE_FORMAT } from '../../constants';

const N_WEEKDAYS = 7;
const N_WEEKS = 53;
const N_MONTHS = 12;

const WORDS_THRESHOLD_TO_COLOR: [number, string][] = [
  [30, 'bg-violet-800'],
  [10, 'bg-violet-600'],
  [3, 'bg-violet-400'],
  [0, 'bg-violet-300'],
  [-1, 'bg-neutral-100'],
];

const WEEKDAY_FORMAT = 'ccc';
const MONTH_FORMAT = 'LLL';

const getColor = (words: number): string =>
  Object.values(WORDS_THRESHOLD_TO_COLOR).find(
    ([threshold]) => words > Number(threshold),
  )![1];

export type StatisticsCalendarProps = {
  stats: WordsByDateStats;
};

type ParsedWordsDateStats = {
  date: DateTime;
  words: number;
};

const repeat = <T,>(n: number, fn: (idx: number) => T): T[] =>
  Array(n)
    .fill(undefined)
    .map((_, idx) => fn(idx));

export const StatisticsCalendar: Component<StatisticsCalendarProps> = (
  props,
) => {
  const fromDate = DateTime.fromFormat(props.stats.from, DATE_FORMAT);
  const untilDate = DateTime.fromFormat(props.stats.until, DATE_FORMAT);
  const fromOffset = fromDate.weekday - 1;
  const totalDays = untilDate.diff(fromDate, 'days').days;
  const statsByDateIndex = Object.fromEntries(
    props.stats.dates.map((dateStats) => [
      DateTime.fromFormat(dateStats.date, DATE_FORMAT).diff(fromDate, 'days')
        .days + fromOffset,
      {
        ...dateStats,
        date: DateTime.fromFormat(dateStats.date, DATE_FORMAT),
      },
    ]),
  );

  const getStatsByDateIndex = (index: number): ParsedWordsDateStats | null => {
    if (index < fromOffset || index >= totalDays) {
      return null;
    }

    return (
      statsByDateIndex[index] ?? {
        date: fromDate.plus({ days: index - fromOffset }),
        words: 0,
      }
    );
  };

  const weekToMonthSpan: Array<{ month: number; span: number }> = [];
  let currentMonth: { month: number; span: number } | null = null;
  for (let i = 0; i < N_WEEKS; i++) {
    const month = fromDate.minus({ days: fromOffset }).plus({ weeks: i }).month;
    if (!currentMonth || month !== currentMonth.month) {
      currentMonth = { month, span: 1 };
      weekToMonthSpan.push(currentMonth);
    } else {
      currentMonth.span++;
    }
  }

  return (
    <div class="overflow-visible">
      <table>
        <thead>
          <tr>
            <td></td>
            {weekToMonthSpan.map(({ month, span }) => (
              <td colSpan={span}>
                <div class="px-1 text-xs">
                  {span > 2
                    ? DateTime.fromObject({ month }).toFormat(MONTH_FORMAT)
                    : ''}
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {repeat(N_WEEKDAYS, (dayOfWeek) => (
            <tr>
              <td>
                <div class="px-1 text-xs">
                  {DateTime.fromObject({ weekday: dayOfWeek + 1 }).toFormat(
                    WEEKDAY_FORMAT,
                  )}
                </div>
              </td>

              {repeat(N_WEEKS, (week) => (
                <td>
                  <StatisticsCalendarCell
                    stats={getStatsByDateIndex(week * N_WEEKDAYS + dayOfWeek)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type StatisticsCalendarCellProps = {
  stats: ParsedWordsDateStats | null;
};

export const StatisticsCalendarCell: Component<StatisticsCalendarCellProps> = (
  props,
) => {
  if (!props.stats) {
    return null;
  }

  const color = () => getColor(props.stats!.words);

  return (
    <div class="relative group p-0.5">
      <div class={`w-3 h-3 ${color()}`}>
        <div
          class={`p-1 hidden group-hover:inline-block absolute top-full z-10 select-none `}
        >
          <div class="w-fit p-1 bg-spacecadet-300 text-white text-sm whitespace-nowrap">
            <p>
              {props.stats!.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
            </p>
            <p>{props.stats!.words} words added</p>
          </div>
        </div>
      </div>
    </div>
  );
};
