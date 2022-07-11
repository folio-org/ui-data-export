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

import {
  DEFAULT_JOB_LOG_COLUMNS,
  JOB_EXECUTION_STATUSES,
  downloadFileByLink,
} from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';

import styles from './JobLogsContainer.css';

const customProperties = {
  visibleColumns: DEFAULT_JOB_LOG_COLUMNS,
  columnWidths: { fileName: '450px' },
  columnMapping: {
    status: 'ui-data-export.status',
    totalRecords: 'ui-data-export.total',
    errors: 'ui-data-export.failed',
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
        {fileName}
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

  const listProps = {
    ...useJobLogsProperties(customProperties),
    resultsFormatter: useJobLogsListFormatter(
      {
        status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
        fileName: record => getFileNameField(record),
        runBy: record => {
          const firstName = record.runBy.firstName || '';
          const lastName = record.runBy.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim();

          return fullName;
        },
        errors: record => {
          const failed = record.progress?.failed;

          return failed || '';
        },
      }
    ),
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
