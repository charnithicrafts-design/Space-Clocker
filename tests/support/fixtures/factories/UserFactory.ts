import { faker } from '@faker-js/faker';

export interface UserProfile {
  id: number;
  name: string;
  level: number;
  xp: number;
  title: string;
}

export const UserFactory = {
  create(overrides?: Partial<UserProfile>): UserProfile {
    return {
      id: 1, // Profile ID is a singleton in Space-Clocker
      name: faker.person.fullName(),
      level: faker.number.int({ min: 1, max: 99 }),
      xp: faker.number.int({ min: 0, max: 1000 }),
      title: faker.person.jobTitle(),
      ...overrides
    };
  }
};
