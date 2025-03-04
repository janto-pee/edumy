import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './entities/skill.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  providers: [SkillResolver, SkillService],
})
export class SkillModule {}
