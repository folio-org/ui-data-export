import { omit } from 'lodash';
import { dayjs } from '@folio/stripes/components';

export const SEARCH_PARAMETER = 'query';
export const SEARCH_INDEX_PARAMETER = 'qindex';

export const OFFSET_PARAMETER = 'offset';
export const LIMIT_PARAMETER = 'limit';

export const SORTING_PARAMETER = 'sort';
export const SORTING_DIRECTION_PARAMETER = 'sortingDirection';
export const ASC_DESCENDING = 'descending';
export const ASC_ASCENDING = 'ascending';
export const DATE_RANGE_FILTER_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

export const buildDateTimeRangeQuery = (filterKey, tenantTimezone, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = dayjs.tz(from, tenantTimezone).startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
  const end = dayjs.tz(to, tenantTimezone).endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const getFilterParams = queryParams => omit(
  queryParams,
  [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER, OFFSET_PARAMETER, LIMIT_PARAMETER]
);

export const buildFilterQuery = (queryParams, getSearchQuery, customFilterMap = {}) => {
  const filterParams = getFilterParams(queryParams);

  return Object.keys(filterParams).map(filterKey => {
    const filterValue = queryParams[filterKey];
    const buildCustomFilterQuery = customFilterMap[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      return `(${getSearchQuery(filterValue, queryParams[SEARCH_INDEX_PARAMETER])})`;
    }

    if (buildCustomFilterQuery) {
      return buildCustomFilterQuery(filterValue);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}==(${filterValue.map(v => v.toString()).join(' or ')})`;
    }

    return `${filterKey}==${filterValue}`;
  }).filter(q => q).join(' and ');
};

export const buildSortingQuery = (queryParams, customSortMap = {}) => {
  if (queryParams.sort) {
    const key = customSortMap[queryParams.sort] || queryParams.sort;

    const replacedKey = key.replace('-', '');

    const sortingDirection = key.startsWith('-') ? ASC_DESCENDING : ASC_ASCENDING;

    if (key.includes('runByFirstName')) {
      return `sortby runByFirstName/sort.${queryParams.sortingDirection || sortingDirection}  runByLastName/sort.${queryParams.sortingDirection || sortingDirection} total/number`;
    }

    return `sortby ${replacedKey}/sort.${queryParams.sortingDirection || sortingDirection} total/number`;
  }

  return '';
};

export const connectQuery = (filterQuery, sortingQuery) => {
  if (sortingQuery) {
    return `(${filterQuery}) ${sortingQuery}`;
  }

  return filterQuery;
};

export const makeQueryBuilder = (searchAllQuery, getSearchQuery, defaultSorting, customFilterMap, customSortMap) => {
  return queryParams => {
    const filterQuery = buildFilterQuery(queryParams, getSearchQuery, customFilterMap) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams, customSortMap) || defaultSorting;

    return connectQuery(filterQuery, sortingQuery);
  };
};
export const getQindex = (qindexValue, queryString) => (qindexValue === 'keyword' && queryString ? { hrId: `${queryString} or fileName=${queryString}` } : { hrId: queryString });
