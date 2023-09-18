export enum AppRoute {
  Words = '/',
  Properties = '/props',
  Exercises = '/exces',
  Statistics = '/stats',
}

export const getAppRouteMatch = (location: string): AppRoute | null => {
  return (Object.entries(AppRoute).find(
    ([, routeLocation]) => location === routeLocation,
  )?.[0] ?? null) as AppRoute | null;
};
