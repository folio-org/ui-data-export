import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const ProfileDetailsActionMenu = ({
  isProfileUsed,
  isDefaultProfile,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}) => {
  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  return (
    <>
      <Button
        data-test-edit-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed}
        onClick={buildButtonClickHandler(onEdit)}
      >
        <Icon icon="edit">
          <FormattedMessage id="stripes-data-transfer-components.edit" />
        </Icon>
      </Button>
      <Button
        data-test-duplicate-profile-button
        buttonStyle="dropdownItem"
        onClick={buildButtonClickHandler(onDuplicate)}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="stripes-data-transfer-components.duplicate" />
        </Icon>
      </Button>
      <Button
        data-test-delete-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed}
        onClick={buildButtonClickHandler(onDelete)}
      >
        <Icon icon="trash">
          <FormattedMessage id="stripes-data-transfer-components.delete" />
        </Icon>
      </Button>
    </>
  );
};

ProfileDetailsActionMenu.propTypes = {
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
};
