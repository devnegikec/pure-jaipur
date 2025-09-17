import type { Config } from 'jest';
import { getJestProjectsAsync } from 'packages1/jest';

export default async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
});
