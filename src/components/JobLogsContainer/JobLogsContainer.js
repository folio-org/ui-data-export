import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import {
  JobLogs,
  getItemFormatter,
  defaultJobLogsColumnMapping,
  defaultJobLogsVisibleColumns,
  defaultJobLogsSortColumns,
  sortStrings,
} from '@folio/stripes-data-transfer-components';

import { tempData } from './tempData';

const sortColumns = {
  ...defaultJobLogsSortColumns,
  status: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
};

const columnMapping = {
  ...defaultJobLogsColumnMapping,
  status: <FormattedMessage id="ui-data-export.status" />,
};

const visibleColumns = [
  ...defaultJobLogsVisibleColumns,
  'status',
];

const JobLogsContainer = props => {
  const { intl } = props;

  const hasLoaded = true;

  return (
    <JobLogs
      columnMapping={columnMapping}
      formatter={getItemFormatter(
        { status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${record.status.toLowerCase()}` }) },
      )}
      visibleColumns={visibleColumns}
      sortColumns={sortColumns}
      hasLoaded={hasLoaded}
      contentData={tempData}
    />
  );
};

JobLogsContainer.propTypes = { intl: intlShape };

export default injectIntl(JobLogsContainer);
