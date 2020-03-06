import {
  Factory,
  faker,
} from '@bigtest/mirage';

import { JOB_EXECUTION_STATUSES } from '../../../../src/utils/constants';

export default Factory.extend({
  id: () => faker.random.uuid(),
  hrId: () => {
    return faker.random.number({
      min: 100000000,
      max: 999999999,
    }).toString();
  },
  fileName: i => `import_${i}.mrc`,
  status: () => JOB_EXECUTION_STATUSES.IN_PROGRESS,
  runBy: () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }),
  jobProfileInfo: () => ({
    id: () => faker.random.uuid(),
    name: 'default',
  }),
  progress: () => {
    const total = faker.random.number();

    return {
      current: faker.random.number({ max: total }),
      total,
    };
  },
  startedDate: () => faker.date.past(1, faker.date.past(1)).toString(),
  completedDate: () => faker.date.past(0.1).toString(),
});
