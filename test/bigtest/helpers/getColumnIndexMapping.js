import { DEFAULT_JOB_LOG_COLUMNS } from '../../../src/utils/constants';

export const getColumnIndexMapping = (
  columns = DEFAULT_JOB_LOG_COLUMNS,
) => {
  return columns.reduce((accumulator, currColumn, index) => {
    accumulator[currColumn] = index;

    return accumulator;
  }, {});
};
