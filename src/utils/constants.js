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

export const JOB_LOGS_STATUS_QUERY_VALUE = [
  JOB_EXECUTION_STATUSES.COMPLETED,
  JOB_EXECUTION_STATUSES.COMPLETED_WITH_ERRORS,
  JOB_EXECUTION_STATUSES.FAIL,
].join(' OR ');

export const FIND_ALL_CQL = 'cql.allRecords=1';

export const QUERY_TEMPLATE = '(sortby "%{query.query}")';

export const INITIAL_RESULT_COUNT = 100;

export const RESULT_COUNT_INCREMENT = 100;

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

export const DEFAULT_JOB_LOG_COLUMNS = [
  'fileName',
  'status',
  'totalRecords',
  'exported',
  'errors',
  'jobProfileName',
  'startedDate',
  'completedDate',
  'runBy',
  'hrId',
];

export const JOB_LOGS_COLUMNS_WIDTHS = {
  fileName: '450px',
  status: '180px',
  totalRecords: '100px',
  exported: '100px',
  errors: '100px',
  jobProfileName: '250px',
  completedDate: '200px',
  startedDate: '200px',
  runBy: '200px',
  hrId: '50px',
};

export const SUPPORTED_FILE_EXTENSIONS = {
  CSV: 'csv',
  CQL: 'cql',
};

export const RECORD_TYPES_DISABLING_MAPPING = {
  [FOLIO_RECORD_TYPES.SRS.type]: FOLIO_RECORD_TYPES.INSTANCE.type,
  [FOLIO_RECORD_TYPES.INSTANCE.type]: FOLIO_RECORD_TYPES.SRS.type,
};

export const searchableIndexes = [
  // {
  //   label: 'keyword',
  //   value: 'keyword',
  //   placeholder: ''
  // },
  {
    label: 'jobExecutionHrId',
    value: 'hrId',
    placeholder: 'jobExecutionHrId',
  },
  // {
  //   label: 'fileName',
  //   value: 'fileName',
  //   placeholder: 'fileName',
  // },
];
