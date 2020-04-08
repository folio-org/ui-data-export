import React, {
  useContext,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  JobLogs,
  getJobLogsItemFormatter,
  defaultJobLogsColumnMapping,
  defaultJobLogsVisibleColumns,
  defaultJobLogsSortColumns,
  sortStrings,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  Callout,
} from '@folio/stripes/components';
import {
  stripesConnect,
  stripesShape,
  IntlConsumer,
} from '@folio/stripes/core';

import {
  downloadFileByLink,
  JOB_EXECUTION_STATUSES,
} from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';
import { DataFetcherContext } from '../../contexts/DataFetcherContext';

import styles from './jobLogsContainer.css';

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

// TODO: remove formatter for jobProfileName once backend is in place
const JobLogsContainer = props => {
  const { stripes: { okapi } } = props;

  const {
    logs,
    hasLoaded,
  } = useContext(DataFetcherContext);
  const calloutRef = useRef(null);

  const handleDownloadError = () => {
    if (!calloutRef.current) return;

    calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-export.communicationProblem" />,
    });
  };

  const downloadExportFile = async record => {
    try {
      const fileName = get(record.exportedFiles, '0.fileName');
      const downloadLink = await getFileDownloadLink(record, okapi);

      await downloadFileByLink(fileName, downloadLink);
    } catch (error) {
      handleDownloadError();

      console.error(error); // eslint-disable-line no-console
    }
  };

  const getFileNameField = record => {
    const fileName = get(record.exportedFiles, '0.fileName');
    const isSuccessfulRecord = record.status === JOB_EXECUTION_STATUSES.SUCCESS;

    if (!isSuccessfulRecord) return fileName;

    return (
      <Button
        data-test-download-file-btn
        buttonStyle="link"
        marginBottom0
        buttonClass={styles.fileNameBtn}
        onClick={() => downloadExportFile(record)}
      >
        {fileName}
      </Button>
    );
  };

  const getRecordsField = record => {
    if (record.status === JOB_EXECUTION_STATUSES.FAIL) return null;

    return get(record, 'progress.current', '');
  };

  return (
    <IntlConsumer>
      {intl => (
        <>
          <JobLogs
            columnMapping={columnMapping}
            formatter={getJobLogsItemFormatter(
              {
                status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${record.status.toLowerCase()}` }),
                fileName: record => getFileNameField(record),
                jobProfileName: record => get(record, 'jobProfileName.name', 'default'),
                totalRecords: record => getRecordsField(record),
              },
            )}
            visibleColumns={visibleColumns}
            sortColumns={sortColumns}
            hasLoaded={hasLoaded}
            contentData={logs}
          />
          <Callout ref={calloutRef} />
        </>
      )}
    </IntlConsumer>
  );
};

JobLogsContainer.propTypes = { stripes: stripesShape.isRequired };

export default stripesConnect(JobLogsContainer);
