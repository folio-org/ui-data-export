import React, {
  useContext,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  get,
  camelCase,
} from 'lodash';

import {
  JobLogs,
  useJobLogsProperties,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
  sortNumbers,
  useJobLogsListFormatter,
  DEFAULT_JOB_LOGS_COLUMNS,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  Callout,
} from '@folio/stripes/components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import { downloadFileByLink } from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';
import { DataFetcherContext } from '../../contexts/DataFetcherContext';

import styles from './jobLogsContainer.css';

const sortColumns = {
  ...DEFAULT_JOB_LOGS_SORT_COLUMNS,
  errors: {
    sortFn: sortNumbers,
    useFormatterFn: true,
  },
  status: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
};

const customProperties = {
  visibleColumns: [
    ...DEFAULT_JOB_LOGS_COLUMNS,
    'errors',
    'status',
  ],
  columnWidths: { fileName: '450px' },
  columnMapping: {
    errors: 'ui-data-export.errors',
    status: 'ui-data-export.status',
  },
};

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

    if (!record.progress.exported) {
      return (
        <span
          title={fileName}
          className={styles.disabledFileName}
        >
          {fileName}
        </span>
      );
    }

    return (
      <Button
        title={fileName}
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

  const intl = useIntl();

  return (
    <>
      <JobLogs
        formatter={useJobLogsListFormatter(
          {
            status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
            fileName: record => getFileNameField(record),
            errors: record => {
              const { progress: { failed } } = record;

              return failed || '';
            },
          },
        )}
        sortColumns={sortColumns}
        hasLoaded={hasLoaded}
        contentData={logs}
        {...useJobLogsProperties(customProperties)}
      />
      <Callout ref={calloutRef} />
    </>
  );
};

JobLogsContainer.propTypes = { stripes: stripesShape.isRequired };

export default stripesConnect(JobLogsContainer);
