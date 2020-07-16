import { Factory } from 'miragejs';
import faker from 'faker';

import { JOB_EXECUTION_STATUSES } from '../../../../src/utils';

export default Factory.extend({
  id: () => faker.random.uuid(),
  hrId: i => i,
  exportedFiles() {
    return Array.from({
      length: faker.random.number({
        min: 1,
        max: 1,
      }),
    }, () => ({
      fileId: faker.random.uuid(),
      fileName: `import-${this.hrId}.mrc`,
    }));
  },
  status: () => JOB_EXECUTION_STATUSES.IN_PROGRESS,
  runBy: () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }),
  jobProfileId: faker.random.uuid(),
  jobProfileName: 'default',
  progress: () => {
    const total = faker.random.number({ max: 1000 });

    return {
      current: faker.random.number({ max: total }),
      total,
    };
  },
  startedDate: () => faker.date.past(1, faker.date.past(1)).toString(),
  completedDate: () => faker.date.past(0.1).toString(),
});
