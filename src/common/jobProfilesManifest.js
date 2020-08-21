import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  FIND_ALL_CQL,
  QUERY_TEMPLATE,
} from '../utils';

const sortMap = {
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName',
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
        query: makeQueryFunction(
          FIND_ALL_CQL,
          QUERY_TEMPLATE,
          sortMap,
          [],
        ),
      },
      staticFallback: { params: {} },
    },
  },
};
