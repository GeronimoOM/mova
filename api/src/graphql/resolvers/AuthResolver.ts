import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'guards/metadata';
import { AuthService } from 'services/AuthService';

@InputType()
export class LoginInput {
  @Field()
  name: string;

  @Field()
  password: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => String, { nullable: true })
  async login(@Args('input') input: LoginInput): Promise<string | null> {
    try {
      return await this.authService.login(input.name, input.password);
    } catch {
      return null;
    }
  }
}
