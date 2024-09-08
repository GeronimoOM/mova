import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Admin = () => SetMetadata('isAdmin', true);

export function isAdmin(
  reflector: Reflector,
  context: ExecutionContext,
): boolean {
  return (
    reflector.get<boolean | undefined>('isAdmin', context.getHandler()) ?? false
  );
}

export const Public = () => SetMetadata('isPublic', true);

export function isPublic(
  reflector: Reflector,
  context: ExecutionContext,
): boolean {
  return (
    reflector.get<boolean | undefined>('isPublic', context.getHandler()) ??
    false
  );
}
