import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

import { useProfileUsedInLogs } from '../../../hooks/useProfileUsedInLogs';

export const JobProfileDeleteModal = ({
  profile,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { isUsedInLogs } = useProfileUsedInLogs(
    profile?.id,
    'job',
    isOpen
  );

  return (
    <ConfirmationModal
      id="delete-job-profile-confirmation-modal"
      open={isOpen}
      heading={<FormattedMessage id="ui-data-export.jobProfiles.delete.confirmationModal.title" />}
      message={(
        <FormattedMessage
          id={isUsedInLogs
            ? 'ui-data-export.jobProfiles.delete.confirmationModal.messageUsedInLogs'
            : 'ui-data-export.jobProfiles.delete.confirmationModal.message'}
          values={{ name: profile?.name }}
        />
      )}
      confirmLabel={<FormattedMessage id="ui-data-export.delete" />}
      cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
      onCancel={onClose}
      onConfirm={onConfirm}
    />
  );
};

JobProfileDeleteModal.propTypes = {
  profile: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

