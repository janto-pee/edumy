import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from 'src/content/entities/content.entity';
import { ContentService } from 'src/content/content.service';
import { ContentItem, ContentItemSchema } from './entities/contentitem.entity';
import { ContentItemResolver } from './contentitem.resolver';
import { ContentItemService } from './contentitem.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentItem.name, schema: ContentItemSchema },
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  providers: [ContentItemResolver, ContentItemService, ContentService],
  exports: [ContentItemService],
})
export class ContentitemModule {}
