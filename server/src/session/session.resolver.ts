import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => Session)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => Session)
  createSession(
    @Args('createSessionInput') createSessionInput: CreateSessionInput,
  ) {
    return this.sessionService.createSession(createSessionInput);
  }

  // @Query(() => [Session], { name: 'session' })
  // findAll() {
  //   return this.sessionService.findAll();
  // }

  @Query(() => Session, { name: 'session' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.sessionService.findOne(id);
  }

  // @Mutation(() => Session)
  // updateSession(@Args('updateSessionInput') updateSessionInput: UpdateSessionInput) {
  //   return this.sessionService.update(updateSessionInput._id, updateSessionInput);
  // }

  //   @Mutation(() => Session)
  //   removeSession(
  //   @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  // ) {
  //     return this.sessionService.remove(id);
  //   }
}
