import { Module } from '@nestjs/common';
import { SkillsetService } from './skillset.service';
import { SkillsetResolver } from './skillset.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Skillset, SkillsetSchema } from './entities/Skillset.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skillset.name, schema: SkillsetSchema },
    ]),
  ],
  providers: [SkillsetResolver, SkillsetService],
})
export class SkillsetModule {}
