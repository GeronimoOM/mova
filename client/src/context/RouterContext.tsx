import React, { createContext, useContext, useMemo } from 'react';
import { AppRoute, useActiveRoute } from '../routes';

export type RouterContextType = {
  activeRoute: AppRoute | null;
};

export const RouterContext = createContext<RouterContextType>({
  activeRoute: null,
});

export type RouterProviderProps = {
  children?: React.ReactNode;
};

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const activeRoute = useActiveRoute();

  const contextValue = useMemo(() => ({ activeRoute }), [activeRoute]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouterContext = () => useContext(RouterContext)!;
