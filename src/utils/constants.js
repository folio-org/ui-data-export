import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

export const JOB_EXECUTION_STATUSES = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERRORS: 'COMPLETED_WITH_ERRORS',
  FAIL: 'FAIL',
};

export const FIND_ALL_CQL = 'cql.allRecords=1';

export const QUERY_TEMPLATE = '(sortby "%{query.query}")';

export const INITIAL_RESULT_COUNT = 100;

export const RESULT_COUNT_INCREMENT = 100;

// TODO: constants below are the only way to check whether the given profile is default one: once alternative solution is in place they should be removed (UIDEXP-128)
export const DEFAULT_JOB_PROFILE_ID = '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a';
export const DEFAULT_MAPPING_PROFILE_ID = '25d81cbe-9686-11ea-bb37-0242ac130002';

export const RECORD_TYPES = [
  {
    value: FOLIO_RECORD_TYPES.INSTANCE.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.INSTANCE.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.HOLDINGS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.HOLDINGS.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.ITEM.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.ITEM.captionId} />,
  },
];

export const SELECTED_STATUS = {
  SELECTED: 'selected',
  UNSELECTED: 'unselected',
};

export const SELECTED_STATUSES = [
  {
    value: SELECTED_STATUS.SELECTED,
    label: <FormattedMessage id={`ui-data-export.${SELECTED_STATUS.SELECTED}`} />,
  },
  {
    value: SELECTED_STATUS.UNSELECTED,
    label: <FormattedMessage id={`ui-data-export.${SELECTED_STATUS.UNSELECTED}`} />,
  },
];
