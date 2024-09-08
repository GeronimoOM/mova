export enum AppRoute {
  Words = '/',
  Properties = '/properties',
  Exercises = '/exercises',
  Progress = '/progress',
  Languages = '/languages',
  User = '/user',
}

export const allowedNoLanguageRoutes = [AppRoute.Languages, AppRoute.User];
