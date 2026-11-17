export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface RoleBearer {
  user_type?: string | null;
  is_admin?: boolean | null;
}

/**
 * Verifica de forma normalizada si un usuario o un string de rol corresponde a un administrador.
 */
export function isAdmin(userOrRole?: RoleBearer | string | null): boolean {
  if (!userOrRole) return false;
  if (typeof userOrRole === 'string') {
    return userOrRole.trim().toLowerCase() === USER_ROLES.ADMIN;
  }
  if (userOrRole.is_admin === true) return true;
  return userOrRole.user_type?.trim().toLowerCase() === USER_ROLES.ADMIN;
}
