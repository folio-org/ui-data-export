import { RestSerializer } from 'miragejs';

export default RestSerializer.extend({
  serialize(...args) {
    const data = RestSerializer.prototype.serialize.apply(this, args);

    return {
      jobExecutions: data.jobExecutions,
      totalRecords: data.jobExecutions.length,
    };
  },
});
