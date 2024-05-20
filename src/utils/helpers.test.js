import '../../test/jest/__mock__';
import { getFormattedFilters, getMappedFilters } from './helpers';
import { buildDateTimeRangeQuery } from '../components/AllJobLogsView/CustomQueryBuilder';
import { JOB_EXECUTION_STATUSES, JOB_LOGS_STATUS_QUERY_VALUE } from './constants';

jest.mock('../components/AllJobLogsView/CustomQueryBuilder', () => ({
  buildDateTimeRangeQuery: jest.fn().mockReturnValue({}),
}));


describe('getFormattedFilters', () => {
  test('should return an empty object when filters is an empty object', () => {
    const filters = {};
    const result = getFormattedFilters(filters);
    expect(result).toEqual({});
  });

  test('should return a single element for arrays with one item', () => {
    const filters = {
      filter1: ['singleValue']
    };
    const result = getFormattedFilters(filters);
    expect(result).toEqual({
      filter1: 'singleValue'
    });
  });

  test('should return the same array for arrays with multiple items', () => {
    const filters = {
      filter1: ['value1', 'value2']
    };
    const result = getFormattedFilters(filters);
    expect(result).toEqual({
      filter1: ['value1', 'value2']
    });
  });

  test('should return the same value for non-array values', () => {
    const filters = {
      filter1: 'nonArrayValue'
    };
    const result = getFormattedFilters(filters);
    expect(result).toEqual({
      filter1: 'nonArrayValue'
    });
  });

  test('should handle a mix of arrays and non-array values', () => {
    const filters = {
      filter1: ['singleValue'],
      filter2: ['value1', 'value2'],
      filter3: 'nonArrayValue'
    };
    const result = getFormattedFilters(filters);
    expect(result).toEqual({
      filter1: 'singleValue',
      filter2: ['value1', 'value2'],
      filter3: 'nonArrayValue'
    });
  });
});

describe('getMappedFilters', () => {
  const timezone = 'UTC';

  beforeEach(() => {
    buildDateTimeRangeQuery.mockClear();
  });

  it('should bind buildDateTimeRangeQuery with completedDate and timezone', () => {
    const filters = getMappedFilters(timezone);
    filters.completedDate('2021-01-01', '2021-12-31');
    expect(buildDateTimeRangeQuery).toHaveBeenCalledWith(['completedDate'], timezone, '2021-01-01', '2021-12-31');
  });

  it('should bind buildDateTimeRangeQuery with startedDate and timezone', () => {
    const filters = getMappedFilters(timezone);
    filters.startedDate('2021-01-01', '2021-12-31');
    expect(buildDateTimeRangeQuery).toHaveBeenCalledWith(['startedDate'], timezone, '2021-01-01', '2021-12-31');
  });

  it('should return correct status query for FAIL', () => {
    const filters = getMappedFilters(timezone);
    const result = filters.status(JOB_EXECUTION_STATUSES.FAIL);
    expect(result).toBe('status=(FAIL or COMPLETED_WITH_ERRORS)');
  });

  it('should return correct status query for an array of statuses', () => {
    const filters = getMappedFilters(timezone);
    const result = filters.status([JOB_EXECUTION_STATUSES.COMPLETED, 'OTHER_STATUS']);
    expect(result).toBe(`status=(${JOB_LOGS_STATUS_QUERY_VALUE} or "OTHER_STATUS")`);
  });

  it('should return correct status query for a single status', () => {
    const filters = getMappedFilters(timezone);
    const result = filters.status('SINGLE_STATUS');
    expect(result).toBe('status=SINGLE_STATUS');
  });

  it('should return correct hrId query', () => {
    const filters = getMappedFilters(timezone);
    const result = filters.hrId('12345');
    expect(result).toBe('hrid="12345"');
  });

  test('should return correct runBy.userId query', () => {
    const filters = getMappedFilters(timezone);
    const result = filters['runBy.userId']('67890');
    expect(result).toBe('runById="67890"');
  });
});
