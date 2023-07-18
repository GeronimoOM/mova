import { Component, ParentProps, createContext, useContext } from 'solid-js';

export type Colors = {
  textColor?: string;
  backgroundColor?: string;
  hoverTextColor?: string;
  hoverBackgroundColor?: string;
};

export type ColorContextType = {
  base?: Colors;
  active?: Colors;
  selected?: Colors;
  disabled?: Colors;
};

const ColorContext = createContext<ColorContextType>();

export type ColorProviderProps = ParentProps & {
  colorContext: ColorContextType;
};

export const ColorProvider: Component<ColorProviderProps> = (props) => {
  const parentColorContext = useColorContext() || {};
  const colorContext: ColorContextType = {
    base: { ...parentColorContext.base, ...props.colorContext.base },
    active: { ...parentColorContext.active, ...props.colorContext.active },
    selected: {
      ...parentColorContext.selected,
      ...props.colorContext.selected,
    },
    disabled: {
      ...parentColorContext.disabled,
      ...props.colorContext.disabled,
    },
  };

  return (
    <ColorContext.Provider value={colorContext}>
      {props.children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);

export const asClasses = (...colors: (string | undefined)[]): string => {
  return colors.filter(Boolean).join(' ');
};
