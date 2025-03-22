import { Module } from '@nestjs/common';
import { ContentitemService } from './contentitem.service';
import { ContentitemResolver } from './contentitem.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Contentitem, ContentitemSchema } from './entities/contentitem.entity';
import { Content, ContentSchema } from 'src/content/entities/content.entity';
import { ContentService } from 'src/content/content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contentitem.name, schema: ContentitemSchema },
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  providers: [ContentitemResolver, ContentitemService, ContentService],
})
export class ContentitemModule {}
