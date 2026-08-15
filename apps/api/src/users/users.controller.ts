import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import {
  type UserSession,
  Session,
  AllowAnonymous,
} from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Session() session: UserSession) {
    return session.user;
  }

  @Patch('me')
  async updateMe(@Session() session: UserSession, @Body() dto: UpdateUserDto) {
    return this.usersService.update(session.user.id, dto);
  }

  @Get('health')
  @AllowAnonymous()
  health() {
    return { ok: true };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
