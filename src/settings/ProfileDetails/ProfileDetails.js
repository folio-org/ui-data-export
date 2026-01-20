import React, {
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';
import {
  FullScreenView,
  Preloader,
} from '@folio/stripes-data-transfer-components';
import { useStripes } from '@folio/stripes/core';

import { ProfileDetailsActionMenu } from '../../components/ProfileDetailsActionMenu';
import { useProfileHandlerWithCallout } from '../utils/useProfileHandlerWithCallout';

export const ProfileDetails = props => {
  const {
    profile,
    isLoading,
    isDefaultProfile,
    children,
    type,
    onCancel,
    onEdit,
    onDelete,
    onDuplicate,
  } = props;
  const [isConfirmationModalOpen, setConfirmationModalState] = useState(false);
  const intl = useIntl();

  const handleDelete = useProfileHandlerWithCallout({
    errorMessageId: `ui-data-export.${type}Profiles.delete.errorCallout`,
    successMessageId: `ui-data-export.${type}Profiles.delete.successCallout`,
    isCanceledAfterError: true,
    onAction: onDelete,
    onActionComplete: () => {
      setConfirmationModalState(false);

      onCancel();
    },
  });


  const stripes = useStripes();
  const hasOnlyViewPerms = stripes.hasPerm('ui-data-export.settings.view') && !stripes.hasPerm('ui-data-export.settings.edit');

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <ProfileDetailsActionMenu
        isDefaultProfile={isDefaultProfile}
        isLockedProfile={profile?.locked}
        onToggle={onToggle}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={() => setConfirmationModalState(true)}
      />
    );
  }, [isDefaultProfile, onEdit, onDuplicate, profile?.locked]);

  return (
    <FullScreenView
      id={`${type}-profile-details`}
      contentLabel={intl.formatMessage({ id: `ui-data-export.${type}Profiles.newProfile` })}
      paneTitle={profile?.name}
      actionMenu={!isLoading && !hasOnlyViewPerms && renderActionMenu}
      onCancel={onCancel}
    >
      {isLoading
        ? <Preloader />
        : (
          <>
            {children}
            <ConfirmationModal
              id={`delete-${type}-profile-confirmation-modal`}
              open={isConfirmationModalOpen}
              heading={<FormattedMessage id={`ui-data-export.${type}Profiles.delete.confirmationModal.title`} />}
              message={(
                <FormattedMessage
                  id={`ui-data-export.${type}Profiles.delete.confirmationModal.message`}
                  values={{ name: profile.name }}
                />
              )}
              confirmLabel={<FormattedMessage id="ui-data-export.delete" />}
              cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
              onCancel={() => setConfirmationModalState(false)}
              onConfirm={() => handleDelete(profile)}
            />
          </>
        )
      }
    </FullScreenView>
  );
};

ProfileDetails.propTypes = {
  isDefaultProfile: PropTypes.bool.isRequired,
  profile: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node,
  type: PropTypes.oneOf([
    'mapping',
    'job',
  ]).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};
