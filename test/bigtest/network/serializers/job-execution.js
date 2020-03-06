import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const data = RestSerializer.prototype.serialize.apply(this, args);

    return {
      jobExecutions: data.jobExecutions,
      totalRecords: data.jobExecutions.length,
    };
  },
});
