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

export const ListSelect = ({ onChange }) => {
  const intl = useIntl();

  const options = [
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

  return (
    <Row>
      <Col xs={6}>
        <Select
          data-testid="choose-job-select"
          required
          dataOptions={options}
          label={<FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.selectTitle" />}
          defaultValue={options[0].value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

ListSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};
