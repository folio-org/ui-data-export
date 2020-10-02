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
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { ProfileDetailsActionMenu } from '../../components/ProfileDetailsActionMenu';
import { useProfileHandlerWithCallout } from '../utils/useProfileHandlerWithCallout';

export const ProfileDetails = props => {
  const {
    profile,
    isLoading,
    isProfileUsed,
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
    onCancel: () => {
      setConfirmationModalState(false);

      onCancel();
    },
  });

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <ProfileDetailsActionMenu
        isDefaultProfile={isDefaultProfile}
        isProfileUsed={isProfileUsed}
        onToggle={onToggle}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={() => setConfirmationModalState(true)}
      />
    );
  }, [isDefaultProfile, isProfileUsed, onEdit, onDuplicate]);

  return (
    <FullScreenView
      id={`${type}-profile-details`}
      contentLabel={intl.formatMessage({ id: `ui-data-export.${type}Profiles.newProfile` })}
      paneTitle={profile?.name}
      actionMenu={!isLoading && renderActionMenu}
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
                <SafeHTMLMessage
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
  isProfileUsed: PropTypes.bool.isRequired,
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
