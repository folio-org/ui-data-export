import {
  buildDateTimeRangeQuery,
  getFilterParams,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
  makeQueryBuilder
} from './CustomQueryBuilder';

describe('CustomQueryBuilder', () => {
  it('buildDateTimeRangeQuery', () => {
    const expectedOutput = '(key>="2022-12-07T18:00:00.000+00:00" and key<="2022-12-09T17:59:59.999+00:00")';

    expect(buildDateTimeRangeQuery('key', '2022-12-08:2022-12-09')).toEqual(expectedOutput)
  });

  it('getFilterParams', () => {
    const queryParams = {
      sort: 'sort',
      sortingDirection: 'desc',
      qindex: 'qindex',
      offset: 'offset',
      limit: 'limit',
      query: 'query',
    }
    const expectedOutput = { query: 'query' };

    expect(getFilterParams(queryParams)).toEqual(expectedOutput)
  });

  it('buildFilterQuery with empty queryParams', () => {

    expect(buildFilterQuery({}, () => {})).toBeFalsy();
  });

  it('buildFilterQuery with query in queryParams', () => {
    const queryParams = {
      sort: 'sort',
      query: 'queryParams',
    };

    expect(buildFilterQuery(queryParams, () => 'queryParams')).toEqual('(queryParams)');
  });

  it('buildFilterQuery with customFilterMap', () => {
    const queryParams = {
      customSort: 'customSort',
    };
    const customFilterMap = {
      customSort: () => 'customSort',
    };

    expect(buildFilterQuery(queryParams, () => {}, customFilterMap)).toEqual('customSort');
  });

  it('buildFilterQuery with array in queryParams', () => {
    const queryParams = {
      arrayQuery: ['array', 'query'],
    };

    expect(buildFilterQuery(queryParams, () => {})).toEqual('arrayQuery==(array or query)');
  });

  it('buildFilterQuery with custom queryParams', () => {
    const queryParams = {
      customQueryParams: 'custom',
    };

    expect(buildFilterQuery(queryParams, () => {})).toEqual('customQueryParams==custom');
  });

  it('buildSortingQuery', () => {
    const queryParams = {
      sort: 'sort',
    };

    const expectedOutput = 'sortby sort/sort.descending progress.total/number'

    expect(buildSortingQuery(queryParams, () => {})).toEqual(expectedOutput);
  });

  it('connectQuery with filterQuery only', () => {
    expect(connectQuery('filterQuery')).toEqual('filterQuery');
  });

  it('makeQueryBuilder', () => {
    const expectedOutput = '(searchAllQuery) defaultSorting'

    expect(makeQueryBuilder('searchAllQuery', () => {}, 'defaultSorting')({})).toEqual(expectedOutput);
  });
})
