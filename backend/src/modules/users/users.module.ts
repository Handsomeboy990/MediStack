import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// No controller yet: the users service is consumed by the auth module.
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
