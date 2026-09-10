export const splitBy = (
  text: string,
  word: string,
): [textBefore: string, word: string, textAfter: string] | null => {
  const indexOfTarget = text.toLowerCase().indexOf(word.toLowerCase());
  if (indexOfTarget === -1) {
    return null;
  }

  return [
    text.slice(0, indexOfTarget),
    text.slice(indexOfTarget, indexOfTarget + word.length),
    text.slice(indexOfTarget + word.length),
  ];
};
