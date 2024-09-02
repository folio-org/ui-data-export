import '../../test/jest/__mock__';
import { getFormattedFilters, getMappedFilters, getSortedUsers, sortByFileName } from './helpers';
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

describe('getSortedUsers', () => {
  it('should return an empty array when input is an empty array', () => {
    const result = getSortedUsers([]);

    expect(result).toEqual([]);
  });

  it('should sort users by firstName', () => {
    const users = [
      { userId: 1, firstName: 'Charlie', lastName: 'Brown' },
      { userId: 2, firstName: 'Alice', lastName: 'Smith' },
      { userId: 3, firstName: 'Bob', lastName: 'Jones' },
    ];

    const result = getSortedUsers(users);

    expect(result).toEqual([
      { userId: 2, firstName: 'Alice', lastName: 'Smith' },
      { userId: 3, firstName: 'Bob', lastName: 'Jones' },
      { userId: 1, firstName: 'Charlie', lastName: 'Brown' },
    ]);
  });

  it('should sort users by lastName if firstNames are equal', () => {
    const users = [
      { userId: 1, firstName: 'John', lastName: 'Smith' },
      { userId: 2, firstName: 'John', lastName: 'Doe' },
      { userId: 3, firstName: 'John', lastName: 'Adams' },
    ];

    const result = getSortedUsers(users);

    expect(result).toEqual([
      { userId: 3, firstName: 'John', lastName: 'Adams' },
      { userId: 2, firstName: 'John', lastName: 'Doe' },
      { userId: 1, firstName: 'John', lastName: 'Smith' },
    ]);
  });

  it('should handle users with missing firstName or lastName', () => {
    const users = [
      { userId: 1, firstName: 'Charlie' },
      { userId: 2, lastName: 'Smith' },
      { userId: 3, firstName: 'Alice', lastName: 'Brown' },
    ];

    const result = getSortedUsers(users);

    expect(result).toEqual([
      { userId: 3, firstName: 'Alice', lastName: 'Brown' },
      { userId: 1, firstName: 'Charlie', lastName: undefined },
      { userId: 2, firstName: undefined, lastName: 'Smith' },
    ]);
  });

  it('should handle users with both firstName and lastName missing', () => {
    const users = [
      { userId: 1 },
      { userId: 2, firstName: 'Alice' },
      { userId: 3, lastName: 'Smith' },
    ];

    const result = getSortedUsers(users);

    expect(result).toEqual([
      { userId: 2, firstName: 'Alice', lastName: undefined },
      { userId: 3, firstName: undefined, lastName: 'Smith' },
      { userId: 1, firstName: undefined, lastName: undefined },
    ]);
  });
});

const createMockComponent = (title) => ({
  props: {
    title,
  },
});

describe('sortByFileName', () => {
  it('should sort alphabetically by title  with .csv extension', () => {
    const item1 = createMockComponent('fileA.csv');
    const item2 = createMockComponent('fileB.csv');
    const item3 = createMockComponent('fileC.csv');

    const items = [item2, item3, item1];
    const sortedItems = items.sort(sortByFileName);

    expect(sortedItems).toEqual([item1, item2, item3]);
  });

  it('should be case insensitive', () => {
    const item1 = createMockComponent('FileA.csv');
    const item2 = createMockComponent('fileB.csv');
    const item3 = createMockComponent('fileC.csv');

    const items = [item2, item3, item1];
    const sortedItems = items.sort(sortByFileName);

    expect(sortedItems).toEqual([item1, item2, item3]);
  });

  it('should handle items with identical titles correctly', () => {
    const item1 = createMockComponent('fileA.csv');
    const item2 = createMockComponent('fileB.csv');
    const item3 = createMockComponent('fileB.csv');

    const items = [item2, item3, item1];
    const sortedItems = items.sort(sortByFileName);

    expect(sortedItems).toEqual([item1, item2, item3]);
  });

  it('should handle empty titles correctly', () => {
    const item1 = createMockComponent('');
    const item2 = createMockComponent('fileB.csv');
    const item3 = createMockComponent('fileA.csv');

    const items = [item2, item3, item1];
    const sortedItems = items.sort(sortByFileName);

    expect(sortedItems).toEqual([item1, item3, item2]);
  });

  it('should handle titles with special characters correctly', () => {
    const item1 = createMockComponent('@fileA.csv');
    const item2 = createMockComponent('fileB.csv');
    const item3 = createMockComponent('fileA.csv');

    const items = [item2, item3, item1];
    const sortedItems = items.sort(sortByFileName);

    expect(sortedItems).toEqual([item1, item3, item2]);
  });
});

