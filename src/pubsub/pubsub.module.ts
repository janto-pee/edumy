import { Module, Global } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB } from './pubsub.decorator';

@Global()
@Module({
  providers: [
    {
      provide: PUBSUB,
      useValue: new PubSub(),
    },
  ],
  exports: [PUBSUB],
})
export class PubSubModule {}
