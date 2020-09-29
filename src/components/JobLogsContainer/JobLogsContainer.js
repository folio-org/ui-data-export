import React, { useRef } from 'react';
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
  DEFAULT_JOB_LOGS_COLUMNS,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  Callout,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { downloadFileByLink } from '../../utils';
import getFileDownloadLink from './fetchFileDownloadLink';

import styles from './jobLogsContainer.css';

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

export const JobLogsContainer = props => {
  const {
    children,
    ...rest
  } = props;

  const { okapi } = useStripes();
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
    if (row?.progress?.failed) {
      const path = `/data-export/log/${row.id}`;

      window.open(path, '_blank').focus();
    }
  };

  const intl = useIntl();

  const listProps = {
    ...useJobLogsProperties(customProperties),
    resultsFormatter: useJobLogsListFormatter(
      {
        status: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
        fileName: record => getFileNameField(record),
        errors: record => {
          const { progress: { failed } } = record;

          return failed || '';
        },
      },
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
