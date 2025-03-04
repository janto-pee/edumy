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
import { ProgrammembershipModule } from './programmembership/programmembership.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { SkillModule } from './skill/skill.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/edumy'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    AuthorModule,
    AddressModule,
    CourseModule,
    CoursemetadataModule,
    ContentModule,
    ContentitemModule,
    ProgrammembershipModule,
    ProgramModule,
    EnrollmentModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
