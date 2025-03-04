import { Module } from '@nestjs/common';
import { ContentitemService } from './contentitem.service';
import { ContentitemResolver } from './contentitem.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Contentitem, ContentitemSchema } from './entities/contentitem.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contentitem.name, schema: ContentitemSchema },
    ]),
  ],
  providers: [ContentitemResolver, ContentitemService],
})
export class ContentitemModule {}
