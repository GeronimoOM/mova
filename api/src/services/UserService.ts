import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserId, UserSettings } from 'models/User';
import { UserRepository } from 'repositories/UserRepository';
import { v1 as uuid } from 'uuid';
import { EncryptionService } from './EncryptionService';

const DEFAULT_SETTINGS: UserSettings = {
  selectedLocale: 'en',
  selectedFont: 'default',
  includeMastered: true,
};

const ADMIN_ID = 'admin-id';
const ADMIN_USER = 'admin';

export interface CreateUserParams {
  id?: UserId;
  name: string;
  password: string;
}

@Injectable()
export class UserService {
  private adminUser: User;

  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private cryptService: EncryptionService,
  ) {}

  async getById(userId: UserId): Promise<User | null> {
    if (userId === ADMIN_ID) {
      return await this.getAdminUser();
    }

    return await this.userRepository.getById(userId);
  }

  async getByName(name: string): Promise<User | null> {
    if (name === ADMIN_USER) {
      return await this.getAdminUser();
    }

    return await this.userRepository.getByName(name);
  }

  async create(params: CreateUserParams): Promise<User> {
    if (params.id) {
      const sameIdUser = await this.getById(params.id);
      if (sameIdUser) {
        throw new Error(`User with id already exists`);
      }
    }

    const name = params.name.trim();
    const sameNameUser = await this.getByName(name);
    if (sameNameUser) {
      throw new Error(`User with name already exists (name:${name})`);
    }

    const user: User = {
      id: params.id ?? uuid(),
      name: name,
      password: await this.cryptService.hash(params.password),
    };

    await this.userRepository.create(user);

    return user;
  }

  async delete(id: UserId): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new Error(`User does not exist (id:${id})`);
    }

    await this.userRepository.delete(id);

    return user;
  }

  async getSettings(userId: UserId) {
    return this.mergeSettings(await this.userRepository.getSettings(userId));
  }

  async updateSettings(userId: UserId, settings: Partial<UserSettings>) {
    await this.userRepository.updateSettings(userId, settings);

    return this.mergeSettings(await this.getSettings(userId));
  }

  private mergeSettings(settings: Partial<UserSettings>) {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    };
  }

  private async getAdminUser(): Promise<User> {
    if (!this.adminUser) {
      const adminPassword =
        this.configService.getOrThrow<string>('admin.secret');

      this.adminUser = {
        id: ADMIN_ID,
        name: ADMIN_USER,
        password: await this.cryptService.hash(adminPassword),
        isAdmin: true,
      };
    }

    return this.adminUser;
  }
}
