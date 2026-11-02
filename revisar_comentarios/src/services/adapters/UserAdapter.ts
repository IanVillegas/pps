import type { AdaptedUser, RawUser } from '@/types/HomePage.types';

export const adaptUser = (raw: RawUser): AdaptedUser => ({
  fullName: `${raw.first_name} ${raw.last_name}`,
  age: raw.age,
});
