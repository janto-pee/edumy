import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class UserSkillsetReport {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
export const UserSkillsetReportSchema =
  SchemaFactory.createForClass(UserSkillsetReport);
// "enterpriseUserSkillsets": [    {    @Prop()userName": "Jerry",    @Prop()userEmail": "example@coursera.org",    @Prop()organizationId": "your_org_id",    @Prop()skillId": "computer-programming",    @Prop()progressPercentage": 38,    @Prop()latestProgressMadeAt": 1602490628732,    @Prop()programIds": [      @Prop()program_id_1 program_id_2 program_id_3"      ],
// @Prop()enterpriseUserSkillList": [        {        @Prop()skillId": "computer-programming",        @Prop()skillName": "Computer Programming",        @Prop()score": 315,        @Prop()proficiency": "ADVANCED"        }      ],
// @Prop()skillsetTargetSkillScores": [        {        @Prop()skillId": "computer-programming",        @Prop()targetProficiencyScore": 100        }      ] } ],
