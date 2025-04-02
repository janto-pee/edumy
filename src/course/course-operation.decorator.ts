import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Decorator that tracks course operations for analytics or logging
 *
 * This decorator can be applied to resolver methods to track usage patterns,
 * log important operations, or collect analytics about course interactions.
 *
 * @example
 * @TrackCourseOperation('view')
 * async findOne(@Args('id') id: string) {
 *   return this.courseService.findOne(id);
 * }
 */
export const TrackCourseOperation = (operationType: string) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Get the current timestamp
      const timestamp = new Date().toISOString();

      // Get the GraphQL context to access user information if needed
      const ctx = GqlExecutionContext.create(this.context);
      const user = ctx.getContext().req?.user;

      // Log the operation (you could replace this with your actual logging logic)
      console.log(
        `[${timestamp}] Course operation: ${operationType} | Method: ${key} | User: ${user?.id || 'anonymous'}`,
      );

      // Call the original method
      const result = await originalMethod.apply(this, args);

      // You could also log the result or perform analytics here

      return result;
    };

    return descriptor;
  };
};

/**
 * Parameter decorator to extract course ID from arguments
 */
export const GetCourseId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const args = gqlCtx.getArgs();

    // Try to find course ID in different possible locations
    return args.id || args.courseId || args.updateCourseInput?._id;
  },
);
