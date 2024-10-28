import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';

@Resolver(() => Session)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => Session)
  createSession(
    @Args('createSessionInput') createSessionInput: CreateSessionInput,
  ) {
    return this.sessionService.create(createSessionInput);
  }

  @Query(() => Session, { name: 'session' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sessionService.findOne(id);
  }

  @Mutation(() => Session)
  updateSession(@Args('id', { type: () => Int }) id: number) {
    return this.sessionService.update(id);
  }
}
