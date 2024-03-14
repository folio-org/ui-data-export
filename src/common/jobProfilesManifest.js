import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  FIND_ALL_CQL,
  QUERY_TEMPLATE,
} from '../utils';

const sortMap = {
  updated: 'updatedDate',
  updatedBy: 'updatedByFirstName updatedByLastName',
};

const ignoredSortFields = ['folioRecord', 'format', '-folioRecord', '-format'];

const mapQuery = (...args) => {
  const [queryParams, pathComponents, resourceValues, logger] = args;

  const updatedArgs = [
    queryParams,
    pathComponents,
    {
      ...resourceValues,
      query: {
        ...resourceValues.query,
        sort: resourceValues.query.sort?.split(',')
          .filter(s => !ignoredSortFields.includes(s))
          .join(',')
      }
    },
    logger
  ];

  return makeQueryFunction(
    FIND_ALL_CQL,
    QUERY_TEMPLATE,
    sortMap,
    [],
  )(...updatedArgs);
};

export const jobProfilesManifest = {
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  jobProfiles: {
    type: 'okapi',
    path: 'data-export/job-profiles',
    records: 'jobProfiles',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      params: {
        query: mapQuery,
      },
      staticFallback: { params: {} },
    },
  },
};
