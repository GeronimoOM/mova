import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserId, UserSettings } from 'models/User';
import { UserRepository } from 'repositories/UserRepository';

const DEFAULT_SETTINGS: UserSettings = {
  selectedLocale: 'en',
  selectedFont: 'default',
  includeMastered: true,
};

@Injectable()
export class UserService {
  private users: User[];

  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    this.users = this.configService.get<User[]>('users');
  }

  async getUser(userId: UserId): Promise<User | null> {
    return this.users.find((user) => user.id === userId) ?? null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) ?? null;
  }

  async getSettings(userId: UserId) {
    return this.mergeSettings(await this.userRepository.getSettings(userId));
  }

  async updateSettings(userId: UserId, settings: Partial<UserSettings>) {
    await this.userRepository.updateSettings(userId, settings);

    return this.mergeSettings(await this.getSettings(userId));
  }

  mergeSettings(settings: Partial<UserSettings>) {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    };
  }
}
