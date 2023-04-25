export enum AppRoute {
  Words = '/',
  Properties = '/properties',
}

export const getAppRouteMatch = (location: string): AppRoute | null => {
  return (Object.entries(AppRoute).find(
    ([, routeLocation]) => location === routeLocation,
  )?.[0] ?? null) as AppRoute | null;
};
