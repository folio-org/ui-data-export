import React, { useContext } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { get } from 'lodash';

import {
  JobLogs,
  getItemFormatter,
  defaultJobLogsColumnMapping,
  defaultJobLogsVisibleColumns,
  defaultJobLogsSortColumns,
  sortStrings,
} from '@folio/stripes-data-transfer-components';

import { DataFetcherContext } from '../../contexts/DataFetcherContext';

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

  const {
    logs,
    hasLoaded,
  } = useContext(DataFetcherContext);

  return (
    <JobLogs
      columnMapping={columnMapping}
      formatter={getItemFormatter(
        {
          status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${record.status.toLowerCase()}` }),
          fileName: record => get(record.exportedFiles, '0.fileName'),
        },
      )}
      visibleColumns={visibleColumns}
      sortColumns={sortColumns}
      hasLoaded={hasLoaded}
      contentData={logs}
    />
  );
};

JobLogsContainer.propTypes = { intl: intlShape };

export default injectIntl(JobLogsContainer);
