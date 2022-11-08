import { omit } from 'lodash';
import moment from 'moment';

export const SEARCH_PARAMETER = 'query';
export const SEARCH_INDEX_PARAMETER = 'qindex';

export const OFFSET_PARAMETER = 'offset';
export const LIMIT_PARAMETER = 'limit';

export const SORTING_PARAMETER = 'sort';
export const SORTING_DIRECTION_PARAMETER = 'sortingDirection';
export const ASC_DIRECTION = 'descending';
export const DATE_RANGE_FILTER_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

export const buildDateTimeRangeQuery = (filterKey, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = moment(from).startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
  const end = moment(to).endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}+00:00" and ${filterKey}<="${end}+00:00")`;
};

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER, OFFSET_PARAMETER, LIMIT_PARAMETER],
);

export const buildFilterQuery = (queryParams, getSearchQuery, customFilterMap = {}) => {
  const filterParams = getFilterParams(queryParams);

  return Object.keys(filterParams).map((filterKey) => {
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
      return `${filterKey}==(${filterValue.map(v => `${v}`).join(' or ')})`;
    }

    return `${filterKey}==${filterValue}`;
  }).filter(q => q).join(' and ');
};

export const buildSortingQuery = (queryParams, customSortMap = {}) => {
  if (queryParams.sort) {
    const key = customSortMap[queryParams.sort] || queryParams.sort;

    return `sortby ${key}/sort.${queryParams.sortingDirection || ASC_DIRECTION} progress.total/number`;
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
  return (queryParams) => {
    const filterQuery = buildFilterQuery(queryParams, getSearchQuery, customFilterMap) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams, customSortMap) || defaultSorting;

    return connectQuery(filterQuery, sortingQuery);
  };
};
