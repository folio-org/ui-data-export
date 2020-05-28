import {
  Factory,
  faker,
} from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  name: i => `Name ${i}`,
  description: i => `Description ${i}`,
  recordTypes: () => [faker.random.arrayElement(['INSTANCE', 'ITEM', 'HOLDINGS'])],
  outputFormat: 'MARC',
  transformations: [],
  metadata: { updatedDate: faker.date.past(0.1, faker.date.past(0.1)).toString() },
  userInfo: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.lastName(),
  },
});
