import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

const JobProfileDetailsActionMenu = ({
  onToggle,
  isProfileUsed,
  isDefaultProfile,
}) => {
  return (
    <>
      <Button
        data-test-edit-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed}
        onClick={onToggle}
      >
        <Icon icon="edit">
          <FormattedMessage id="stripes-data-transfer-components.edit" />
        </Icon>
      </Button>
      <Button
        data-test-duplicate-profile-button
        buttonStyle="dropdownItem"
        onClick={onToggle}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="stripes-data-transfer-components.duplicate" />
        </Icon>
      </Button>
      <Button
        data-test-delete-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed}
        onClick={onToggle}
      >
        <Icon icon="trash">
          <FormattedMessage id="stripes-data-transfer-components.delete" />
        </Icon>
      </Button>
    </>
  );
};

JobProfileDetailsActionMenu.propTypes = {
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default JobProfileDetailsActionMenu;
