import { Module } from '@nestjs/common';
import { SkillsResolver } from './skills.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './entities/Skill.entity';
import { SkillService } from './skills.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  providers: [SkillsResolver, SkillService],
})
export class SkillsModule {}
