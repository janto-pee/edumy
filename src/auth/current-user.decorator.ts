import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Parameter decorator that extracts the current user from the request
 * Can be used in GraphQL resolvers to get the authenticated user
 *
 * Usage:
 * @Query()
 * someQuery(@CurrentUser() user: User) {
 *   // user contains the authenticated user data
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Return the user from the request (set by the auth guard)
    return request.user;
  },
);
