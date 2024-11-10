import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
// import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';
// import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
