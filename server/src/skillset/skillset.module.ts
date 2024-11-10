import { Module } from '@nestjs/common';
import { SkillsetService } from './skillset.service';
import { SkillsetResolver } from './skillset.resolver';

@Module({
  providers: [SkillsetResolver, SkillsetService],
})
export class SkillsetModule {}
