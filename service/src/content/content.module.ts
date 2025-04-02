import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from './entities/content.entity';
import { ContentitemService } from 'src/contentitem/contentitem.service';
import {
  Contentitem,
  ContentitemSchema,
} from 'src/contentitem/entities/contentitem.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Contentitem.name, schema: ContentitemSchema },
    ]),
  ],
  providers: [ContentResolver, ContentService, ContentitemService],
})
export class ContentModule {}
