import { Inject } from '@nestjs/common';

export const PUBSUB = 'PUBSUB';

export const InjectPubSub = () => Inject(PUBSUB);
