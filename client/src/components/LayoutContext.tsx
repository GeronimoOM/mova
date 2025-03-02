import React, { createContext, useContext, useMemo } from 'react';

export type LayoutContextType = {
  containerRef: React.RefObject<HTMLElement | null> | null;
};

export const LayoutContext = createContext<LayoutContextType>({
  containerRef: null,
});

export type LayoutProviderProps = {
  children?: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
};

export const LayoutProvider = ({
  children,
  containerRef,
}: LayoutProviderProps) => {
  const contextValue = useMemo(() => ({ containerRef }), [containerRef]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext)!;
