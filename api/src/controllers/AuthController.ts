import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Public } from 'guards/metadata';
import { UserId } from 'models/User';
import { AuthService } from 'services/AuthService';
import { CreateUserParams, UserService } from 'services/UserService';

@Controller('/api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('/login')
  async login(
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    return {
      token: await this.authService.login(name, password),
    };
  }

  @Post('/users')
  async createUser(@Body() params: CreateUserParams) {
    return await this.userService.create(params);
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: UserId) {
    return await this.userService.delete(id);
  }
}
