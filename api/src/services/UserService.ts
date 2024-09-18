import { Injectable } from '@nestjs/common';
import { UserId, UserSettings } from 'models/User';
import { UserRepository } from 'repositories/UserRepository';

const DEFAULT_SETTINGS: UserSettings = {
  selectedLocale: 'en',
};

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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
