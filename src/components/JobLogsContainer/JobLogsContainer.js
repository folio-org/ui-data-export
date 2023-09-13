import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  get,
  camelCase,
} from 'lodash';

import {
  useJobLogsProperties,
  useJobLogsListFormatter,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  Callout,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { useTimeFormatter } from '@folio/stripes-data-transfer-components/lib/utils';
import {
  DEFAULT_JOB_LOG_COLUMNS,
  JOB_LOGS_COLUMNS_WIDTHS,
  JOB_EXECUTION_STATUSES,
  downloadFileByLink,
} from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';

import styles from './JobLogsContainer.css';

const customProperties = {
  visibleColumns: DEFAULT_JOB_LOG_COLUMNS,
  columnMapping: {
    status: 'ui-data-export.status',
    totalRecords: 'ui-data-export.total',
    errors: 'ui-data-export.failed',
    exported: 'ui-data-export.exported',
    startedDate: 'ui-data-export.startedDate',
  },
};

export const JobLogsContainer = props => {
  const {
    children,
    ...rest
  } = props;

  const { okapi } = useStripes();
  const history = useHistory();
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

      downloadFileByLink(fileName, downloadLink);
    } catch (error) {
      handleDownloadError();

      console.error(error); // eslint-disable-line no-console
    }
  };

  const getFileNameField = record => {
    const fileName = get(record.exportedFiles, '0.fileName');

    if (!record.progress?.exported) {
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
        onClick={e => {
          e.stopPropagation();
          downloadExportFile(record);
        }}
      >
        <span className={styles.downloadFile}>
          {fileName}
        </span>
      </Button>
    );
  };

  const handleRowClick = (e, row) => {
    if (row.status !== JOB_EXECUTION_STATUSES.COMPLETED) {
      const path = `/data-export/log/${row.id}`;

      history.push(path);
    }
  };

  const intl = useIntl();
  const formatTime = useTimeFormatter();

  const getStartedDateDateFormatter = format => {
    return record => {
      const { startedDate } = record;

      return format(
        startedDate,
        {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }
      );
    };
  };

  const listProps = {
    ...useJobLogsProperties(customProperties),
    resultsFormatter: useJobLogsListFormatter(
      {
        status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
        fileName: record => getFileNameField(record),
        runBy: record => {
          const firstName = record.runBy?.firstName || '';
          const lastName = record.runBy?.lastName || '';

          return `${firstName} ${lastName}`.trim();
        },
        totalRecords: record => {
          return intl.formatNumber(record.progress?.total);
        },
        errors: record => {
          const failedSrs = record.progress?.failed?.duplicatedSrs;
          const failedOther = record.progress?.failed?.otherFailed;

          switch (true) {
            case failedSrs === 0 && failedOther > 0:
              return `${failedOther}`;
            case failedSrs > 0 && failedOther > 0:
              return intl.formatMessage({
                id: 'ui-data-export.column.errors.duplicatesWithOthers',
              }, {
                failedOther,
                failedSrs,
              });
            case failedSrs > 0 && failedOther === 0:
              return intl.formatMessage({
                id: 'ui-data-export.column.errors.duplicates',
              }, {
                failedSrs,
              });
            default:
              return '';
          }
        },
        exported: record => {
          const exported = record.progress?.exported;

          return exported || '';
        },
        startedDate: getStartedDateDateFormatter(formatTime),
      }
    ),
    columnWidths: JOB_LOGS_COLUMNS_WIDTHS,
  };

  return (
    <>
      {children({
        listProps,
        onRowClick: handleRowClick,
        ...rest,
      })}
      <Callout ref={calloutRef} />
    </>
  );
};

JobLogsContainer.propTypes = { children: PropTypes.func.isRequired };
