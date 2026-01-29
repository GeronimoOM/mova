import { Logger } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { toTimestamp } from './datetime';

const TEMPLATE_WRAP_REGEX = /\{\{([^}]+)\}\}/dg;
const EXPRESSION_TYPE_SEPARATOR = ':';

const EXPRESSION_TYPE_DATETIME = 'dt'; // example: {{dt:now+PT1H}}
const DURATION_REGEX = /P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?/;
const EXPRESSION_TYPE_DATETIME_REGEX = new RegExp(
  `^now([+-])(${DURATION_REGEX.source})$`,
);

type TemplateCompilationContext = {
  now: DateTime;
};

export function compileTemplate(str: string): string {
  const result: string[] = [];

  const context = {
    now: DateTime.utc(),
  };

  let index = 0;
  for (const match of str.matchAll(TEMPLATE_WRAP_REGEX)) {
    const [matchFull, matchExp] = match;
    const [matchFrom, matchTo] = match.indices![0];
    result.push(str.slice(index, matchFrom));
    result.push(compileExpression(matchExp, context) ?? matchFull);
    index = matchTo;
  }
  result.push(str.slice(index, str.length));

  return result.join('');
}

export function compileExpression(
  expression: string,
  context: TemplateCompilationContext,
): string | null {
  const [expressionType, expressionValue] = expression.split(
    EXPRESSION_TYPE_SEPARATOR,
  );

  switch (expressionType) {
    case EXPRESSION_TYPE_DATETIME:
      return compileDateTimeExpression(expressionValue, context);
    default:
      Logger.warn(`No compiler for expression type ${expressionType}`);
      return null;
  }
}

function compileDateTimeExpression(
  expression: string,
  context: TemplateCompilationContext,
): string | null {
  const match = expression.match(EXPRESSION_TYPE_DATETIME_REGEX);
  if (!match) {
    Logger.warn(`Failed to compile expression ${expression}`);
    return null;
  }
  const [, matchSign, matchDuration] = match;

  const duration = Duration.fromISO(matchDuration);
  if (!duration.isValid) {
    Logger.warn(`Failed to compile expression duration ${expression}`);
    return null;
  }

  const dateTime =
    matchSign === '+'
      ? context.now.plus(duration)
      : context.now.minus(duration);

  return toTimestamp(dateTime);
}
