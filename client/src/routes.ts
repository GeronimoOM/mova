import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export enum AppRoute {
  Default = '/',
  Words = '/words',
  WordNew = '/words/new',
  Word = '/words/:id',
  Properties = '/properties',
  Exercises = '/exercises',
  Progress = '/progress',
  Languages = '/languages',
  User = '/user',
}

export const allowedNoLanguageRoutes = [AppRoute.Languages, AppRoute.User];

export const wordRoute = (wordId: string) =>
  AppRoute.Word.replace(':id', wordId);

export const useActiveRoute = (): AppRoute | null => {
  const location = useLocation();

  return useMemo(() => {
    const matchingRoutes =
      Object.values(AppRoute).filter((route) =>
        location.pathname.startsWith(route),
      ) ?? [];

    if (!matchingRoutes.length) {
      return null;
    }

    return matchingRoutes.reduce(
      (longestRoute, route) =>
        route.length > longestRoute.length ? route : longestRoute,
      matchingRoutes[0],
    );
  }, [location.pathname]);
};
