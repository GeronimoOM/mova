import { Component, For } from 'solid-js';
import { ExerciseType, exercisesProps } from './exercises';
import { IconTypes } from 'solid-icons';
import {
  ColorContextType,
  ColorProvider,
  asClasses,
} from '../common/ColorContext';
import { Icon } from '../common/Icon';
import { A } from '@solidjs/router';
import { AppRoute } from '../../routes';

export const ExercisesPage: Component = () => {
  return (
    <div
      class="mx-auto grid max-w-[24rem] grid-flow-row
    grid-cols-1 justify-items-stretch gap-2 p-2 sm:max-w-[48rem] sm:grid-cols-2"
    >
      <For each={Object.entries(exercisesProps)}>
        {([type, { title, icon, route }]) => (
          <ExerciseBanner
            type={type as ExerciseType}
            title={title}
            icon={icon}
            route={`${AppRoute.Exercises}${route}`}
          />
        )}
      </For>
    </div>
  );
};

type ExerciseBannerProps = {
  type: ExerciseType;
  title: string;
  icon: IconTypes;
  route: string;
};

export const ExerciseBanner: Component<ExerciseBannerProps> = (props) => {
  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-spacecadet-300',
      backgroundColor: 'bg-coolgray-300',
      hoverBackgroundColor: 'hover:bg-coolgray-200',
    },
  };

  const baseClasses = asClasses(
    colorContext.base?.textColor,
    colorContext.base?.backgroundColor,
    colorContext.base?.hoverTextColor,
    colorContext.base?.hoverBackgroundColor,
  );

  return (
    <ColorProvider colorContext={colorContext}>
      <A href={props.route} end={true}>
        <div
          class={`flex min-h-[10rem] flex-row items-center p-3 ${baseClasses}`}
        >
          <div class="p-2">
            <Icon icon={props.icon} />
          </div>
          <p class="text-lg">{props.title}</p>
        </div>
      </A>
    </ColorProvider>
  );
};
