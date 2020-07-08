export const JOB_EXECUTION_STATUSES = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const FIND_ALL_CQL = 'cql.allRecords=1';

export const QUERY_TEMPLATE = '(sortby "%{query.query}")';

export const INITIAL_RESULT_COUNT = 100;

export const RESULT_COUNT_INCREMENT = 100;

// TODO: constants below are the only way to check whether the given profile is default one: once alternative solution is in place they should be removed (UIDEXP-128)
export const DEFAULT_JOB_PROFILE_ID = '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a';
export const DEFAULT_MAPPING_PROFILE_ID = '25d81cbe-9686-11ea-bb37-0242ac130002';
