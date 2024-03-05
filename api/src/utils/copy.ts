export function copy<T>(data: T) {
  return JSON.parse(JSON.stringify(data));
}
