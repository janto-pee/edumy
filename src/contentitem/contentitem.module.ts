import { Module } from '@nestjs/common';
import { ContentitemService } from './contentitem.service';
import { ContentitemResolver } from './contentitem.resolver';

@Module({
  providers: [ContentitemResolver, ContentitemService],
})
export class ContentitemModule {}
