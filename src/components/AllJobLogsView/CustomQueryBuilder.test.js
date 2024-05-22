import '../../../test/jest/__mock__';

import {
  buildDateTimeRangeQuery,
  buildSortingQuery,
  connectQuery,
} from './CustomQueryBuilder';

describe('CustomQueryBuilder', () => {
  it('buildDateTimeRangeQuery', () => {
    const expectedOutput = '(key>="2022-12-08T00:00:00.000" and key<="2022-12-09T23:59:59.999")';

    expect(buildDateTimeRangeQuery('key', 'UTC', '2022-12-08:2022-12-09')).toEqual(expectedOutput);
  });

  it('buildSortingQuery', () => {
    const queryParams = {
      sort: 'sort',
    };

    const expectedOutput = 'sortby sort/sort.ascending total/number';

    expect(buildSortingQuery(queryParams, () => {})).toEqual(expectedOutput);
  });

  it('buildSortingQuery when key is runByFirstName', () => {
    const queryParams = {
      sort: 'runByFirstName',
    };

    const expectedOutput = 'sortby runByFirstName/sort.ascending  runByLastName/sort.ascending total/number';

    expect(buildSortingQuery(queryParams, () => {})).toEqual(expectedOutput);
  });

  it('connectQuery with filterQuery only', () => {
    expect(connectQuery('filterQuery')).toEqual('filterQuery');
  });
});
