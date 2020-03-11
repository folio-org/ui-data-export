import React, { useRef } from 'react';
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

import {
  Button,
  Callout,
} from '@folio/stripes/components';
import {
  stripesConnect, stripesShape,
} from '@folio/stripes/core';
import { getFileDownloadLinkRequest } from './jobLogsApi';
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
  const {
    intl, stripes: { okapi },
  } = props;

  const calloutRef = useRef(null);

  const hasLoaded = true;

  const handleDownloadError = () => {
    if (!calloutRef.current) return;

    calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-export.communicationProblem" />,
    });
  };

  const getFileDownloadLink = async record => {
    try {
      const downloadLink = await getFileDownloadLinkRequest(record, okapi);

      await downloadFile(record.exportedFiles[0].fieldName, downloadLink);
    } catch (error) {
      handleDownloadError();

      console.error(error); // eslint-disable-line no-console
    }
  };

  const downloadFile = (name, downloadLink) => {
    const elem = window.document.createElement('a');

    elem.href = downloadLink;
    elem.download = name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const getFileNameField = record => {
    return (
      <Button
        buttonStyle="link"
        marginBottom0
        onClick={() => getFileDownloadLink(record)}
      >
        {record.fileName}
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
          },
        )}
        visibleColumns={visibleColumns}
        sortColumns={sortColumns}
        hasLoaded={hasLoaded}
        contentData={tempData}
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
