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

// import { Global, Module } from '@nestjs/common';
// import { PubSub } from 'graphql-subscriptions';

// @Global()
// @Module({
//   providers: [
//     {
//       provide: 'PUB_SUB',
//       useValue: new PubSub(),
//     },
//   ],
//   exports: ['PUB_SUB'],
// })
// export class PubSubModule {}
