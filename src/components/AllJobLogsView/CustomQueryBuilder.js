import { dayjs } from '@folio/stripes/components';
import { ASC_DIRECTION, DESC_DIRECTION } from '@folio/stripes-acq-components';

export const DATE_RANGE_FILTER_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

export const buildDateTimeRangeQuery = (filterKey, tenantTimezone, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = dayjs.tz(from, tenantTimezone).startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
  const end = dayjs.tz(to, tenantTimezone).endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const buildSortingQuery = (queryParams, customSortMap = {}) => {
  if (queryParams.sort) {
    const key = customSortMap[queryParams.sort] || queryParams.sort;

    const replacedKey = key.replace('-', '');

    const sortingDirection = key.startsWith('-') ? DESC_DIRECTION : ASC_DIRECTION;

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
