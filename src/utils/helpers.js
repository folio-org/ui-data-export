import { buildDateTimeRangeQuery } from '../components/AllJobLogsView/CustomQueryBuilder';
import { JOB_EXECUTION_STATUSES, JOB_LOGS_STATUS_QUERY_VALUE } from './constants';

export const getFormattedFilters = (filters) => Object.entries(filters).reduce((acc, [key, value]) => {
  if (Array.isArray(value)) {
    if (value.length === 1) {
      acc[key] = value[0];
    } else {
      acc[key] = value;
    }
  } else {
    acc[key] = value;
  }

  return acc;
}, {});

export const getMappedFilters = (timezone) => ({
  completedDate: buildDateTimeRangeQuery.bind(null, ['completedDate'], timezone),
  startedDate: buildDateTimeRangeQuery.bind(null, ['startedDate'], timezone),
  status: query => {
    switch (true) {
      case query === JOB_EXECUTION_STATUSES.FAIL:
        return 'status=(FAIL or COMPLETED_WITH_ERRORS)';
      case Array.isArray(query):
        return `status=(${query.map(v => (
          v === JOB_EXECUTION_STATUSES.COMPLETED
            ? JOB_LOGS_STATUS_QUERY_VALUE
            : `"${v}"`)).join(' or ')})`;
      default:
        return `status=${query}`;
    }
  },
  hrId: query => `hrid="${query}"`,
  'runBy.userId': query => `runById="${query}"`,
});

export const getSortedUsers = (users = []) => users.map(item => {
  return {
    userId: item.userId,
    firstName: item.firstName,
    lastName: item.lastName,
  };
})
  .sort((userA, userB) => {
    const nameA = userA.firstName || userA.lastName;
    const nameB = userB.firstName || userB.lastName;

    if (userA.firstName?.localeCompare(userB.firstName) === 0) {
      return userA.lastName.localeCompare(userB.lastName);
    }

    return nameA.localeCompare(nameB);
  });
