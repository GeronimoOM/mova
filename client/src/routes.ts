export enum AppRoute {
  Default = '/',
  Words = '/words',
  Word = '/words/:id',
  WordNew = '/words/new',
  Properties = '/properties',
  Exercises = '/exercises',
  Progress = '/progress',
  Languages = '/languages',
  User = '/user',
}

export const allowedNoLanguageRoutes = [AppRoute.Languages, AppRoute.User];

export const wordRoute = (wordId: string) => `/words/${wordId}`;
