import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AddressModule } from './address/address.module';
import { ProgramModule } from './program/program.module';
import { CourseModule } from './course/course.module';
import { CoursemetadataModule } from './coursemetadata/coursemetadata.module';
import { ContentModule } from './content/content.module';
import { ContentitemModule } from './contentitem/contentitem.module';
import { SkillModule } from './skill/skill.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/edumy'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    AddressModule,
    CourseModule,
    CoursemetadataModule,
    ContentModule,
    ContentitemModule,
    ProgramModule,
    SkillModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
