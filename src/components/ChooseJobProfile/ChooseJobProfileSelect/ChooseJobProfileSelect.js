import React from 'react';
import {
  FormattedMessage, useIntl,
} from 'react-intl';
import {
  Select,
  Col,
  Row,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';

export const ListSelect = ({ type, onChange, value, required = true, disabled = false }) => {
  const intl = useIntl();

  const idLabel = <FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.selectTitle" />;
  const idOptions = [
    {
      value: '',
      label: '',
      disabled: true,
    },
    {
      value: 'instance',
      label: intl.formatMessage({ id: 'ui-data-export.instance' }),
    },
    {
      value: 'holding',
      label: intl.formatMessage({ id: 'ui-data-export.holdings' }),
    },
    {
      value: 'authority',
      label: intl.formatMessage({ id: 'ui-data-export.authorities' }),
    },
  ];

  const recordLabel = <FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.selectRecordTitle" />;
  const recordOptions = [
    {
      value: '',
      label: '',
      disabled: true,
    },
    {
      value: 'same',
      label: intl.formatMessage({ id: 'ui-data-export.jobProfiles.selectProfile.modal.sameRecordTypeAsIdType' }),
    },
    {
      value: 'LINKED_DATA',
      label: intl.formatMessage({ id: 'ui-data-export.linkedData' }),
    },
  ];

  const options = (type === 'record') ? recordOptions : idOptions;
  const label = (type === 'record') ? recordLabel : idLabel;
  const testId = 'choose-job-select-' + type;

  return (
    <Row>
      <Col xs={6}>
        <Select
          data-testid={testId}
          required={required}
          disabled={disabled}
          dataOptions={options}
          label={label}
          defaultValue={options[0].value}
          onChange={onChange}
          value={value}
        />
      </Col>
    </Row>
  );
};

ListSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};
