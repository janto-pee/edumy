import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqll-auth.guard';
import { RolesGuard } from 'src/auth/role.gurad';
import { Roles } from './roles.decorator';

/**
 * Combined authentication and authorization decorator
 *
 * This decorator combines authentication check with optional role-based authorization
 * in a single, easy-to-use decorator.
 *
 * @param roles - Optional roles that are allowed to access the endpoint
 * @example
 * // Requires authentication only
 * @Auth()
 * async findCourses() {}
 *
 * // Requires authentication and ADMIN role
 * @Auth('ADMIN')
 * async removeCourse() {}
 *
 * // Requires authentication and either ADMIN or INSTRUCTOR role
 * @Auth('ADMIN', 'INSTRUCTOR')
 * async updateCourse() {}
 */
export function Auth(...roles: string[]) {
  // If roles are provided, apply both authentication and role guards
  if (roles.length > 0) {
    return applyDecorators(
      UseGuards(GqlAuthGuard, RolesGuard),
      Roles(...roles),
    );
  }

  // If no roles are provided, only apply authentication guard
  return applyDecorators(UseGuards(GqlAuthGuard));
}
