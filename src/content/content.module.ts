import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from './entities/content.entity';
import { ContentItemService } from 'src/contentitem/contentitem.service';
import {
  ContentItem,
  ContentItemSchema,
} from 'src/contentitem/entities/contentitem.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: ContentItem.name, schema: ContentItemSchema },
    ]),
  ],
  providers: [ContentResolver, ContentService, ContentItemService],
})
export class ContentModule {}
