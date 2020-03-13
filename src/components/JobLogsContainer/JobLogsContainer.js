import React, {
  useContext,
  useRef,
} from 'react';
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
} from '@folio/stripes/core';

import {
  downloadFileByLink,
  JOB_EXECUTION_STATUSES,
} from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';
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
  'fileName',
  'jobProfileName',
  'completedDate',
  'status',
];

// TODO: remove formatter for jobProfileName once backend is in place
const JobLogsContainer = props => {
  const {
    intl,
    stripes: { okapi },
  } = props;

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
    const successRec = record.status === JOB_EXECUTION_STATUSES.SUCCESS;

    return (
      <Button
        data-test-download-file-btn
        buttonStyle="link"
        marginBottom0
        style={successRec ? null : { pointerEvents: 'none' }}
        onClick={successRec ? () => downloadExportFile(record) : null}
      >
        {get(record.exportedFiles, '0.fileName')}
      </Button>
    );
  };

  return (
    <>
      <JobLogs
        columnMapping={columnMapping}
        formatter={getItemFormatter(
          {
            status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${record.status.toLowerCase()}` }),
            fileName: record => getFileNameField(record),
            jobProfileName: record => get(record, 'jobProfileName.name', 'default'),
          },
        )}
        visibleColumns={visibleColumns}
        sortColumns={sortColumns}
        hasLoaded={hasLoaded}
        contentData={logs}
      />
      <Callout ref={calloutRef} />
    </>
  );
};

JobLogsContainer.propTypes = {
  intl: intlShape,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(injectIntl(JobLogsContainer));
