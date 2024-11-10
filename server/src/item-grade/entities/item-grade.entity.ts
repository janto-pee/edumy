import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class ItemGrade {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  itemId: string;

  @Prop()
  itemName: string;

  @Prop()
  itemType: string;

  @Prop()
  itemOrder: string;

  @Prop()
  isItemPassed: string;

  @Prop()
  itemRiskFlags: string;

  @Prop()
  itemDeadline: string;

  @Prop()
  moduleName: string;

  @Prop()
  lessonId: string;

  @Prop()
  itemGrade: string;

  @Prop()
  moduleId: string;

  @Prop()
  itemWeight: string;

  @Prop()
  lessonName: string;
}
