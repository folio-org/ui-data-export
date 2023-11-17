import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

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

  const stripes = useStripes();
  const hasOnlyViewPerms = stripes.hasPerm('settings.data-export.view') && !stripes.hasPerm('ui-data-export.settings.enabled');


  return (
    <>
      <Button
        data-test-edit-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed || hasOnlyViewPerms}
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
        disabled={hasOnlyViewPerms}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="stripes-data-transfer-components.duplicate" />
        </Icon>
      </Button>
      <Button
        data-test-delete-profile-button
        buttonStyle="dropdownItem"
        disabled={isDefaultProfile || isProfileUsed || hasOnlyViewPerms}
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
