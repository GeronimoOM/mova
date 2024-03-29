import { Component } from 'solid-js';
import { Button } from '../../common/Button';
import { IconTypes } from 'solid-icons';
import { TbPlugConnectedX } from 'solid-icons/tb';
import { AiFillCloud } from 'solid-icons/ai';
import { isSynced } from '../../../sw/client/sync';

export const SyncStatusButton: Component = () => {
  const icon = (): IconTypes => (isSynced() ? AiFillCloud : TbPlugConnectedX);

  return <Button icon={icon()} onClick={() => {}} />;
};
