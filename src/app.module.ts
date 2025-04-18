import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
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
import { PubSubModule } from './pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? 'mongodb://localhost:27017/edum',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
        // {
        //   onConnect: (context) => {
        //     // context.connectionParams contains the headers
        //     const { connectionParams } = context;
        //     // You can validate auth tokens here
        //     return { user: validateToken(connectionParams.authToken) };
        //   },
        // },
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // cors: {
      //   origin: ['http://localhost:3000', 'https://yourdomain.com'],
      //   credentials: true,
      // },
    }),
    PubSubModule,
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
