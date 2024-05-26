import { SetMetadata } from '@nestjs/common';
import { InputType, Field, Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from 'services/AuthService';

@InputType()
export class LoginInput {
  @Field()
  name: string;

  @Field()
  password: string;
}

export const Public = () => SetMetadata('isPublic', true);

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation((returns) => String, { nullable: true })
  async token(@Args('input') input: LoginInput): Promise<string | null> {
    try {
      return await this.authService.auth(input.name, input.password);
    } catch {
      return null;
    }
  }
}
