import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Modal, ModalFooter, Loading } from '@folio/stripes/components';
import { useMappingProfileUsedInJobProfiles } from '../../../hooks/useMappingProfileUsedInJobProfiles';

export const MappingProfileDeleteModal = ({ profile, isOpen, onClose, onConfirm }) => {
  const { jobProfiles, isUsedInJobProfiles, isLoading } =
    useMappingProfileUsedInJobProfiles(profile?.id, isOpen);

  const jobProfilesNames = (jobProfiles || [])
    .map(jp => jp?.name)
    .filter(Boolean)
    .join(', ');

  const cannotDelete = !isLoading && isUsedInJobProfiles;

  const label = cannotDelete
    ? <FormattedMessage id="ui-data-export.mappingProfiles.delete.cannotDeleteModal.title" />
    : <FormattedMessage id="ui-data-export.mappingProfiles.delete.confirmationModal.title" />;

  const renderFooter = () => {
    if (isLoading) {
      return (
        <Button buttonStyle="default" onClick={onClose} marginBottom0>
          <FormattedMessage id="ui-data-export.cancel" />
        </Button>
      );
    }

    if (cannotDelete) {
      return (
        <Button buttonStyle="primary" onClick={onClose} marginBottom0>
          <FormattedMessage id="stripes-components.close" />
        </Button>
      );
    }

    return (
      <>
        <Button
          buttonStyle="primary"
          onClick={onConfirm}
          marginBottom0
        >
          <FormattedMessage id="ui-data-export.delete" />
        </Button>
        <Button
          buttonStyle="default"
          onClick={onClose}
          marginBottom0
        >
          <FormattedMessage id="ui-data-export.cancel" />
        </Button>
      </>
    );
  };

  const footer = (
    <ModalFooter>
      {renderFooter()}
    </ModalFooter>
  );

  return (
    <Modal
      open={isOpen}
      id="mapping-profile-delete-modal"
      label={label}
      scope="module"
      size="small"
      footer={footer}
    >
      {isLoading && <Loading />}

      {!isLoading && cannotDelete && (
        <FormattedMessage
          id="ui-data-export.mappingProfiles.delete.cannotDeleteModal.message"
          values={{ jobProfilesNames }}
        />
      )}

      {!isLoading && !cannotDelete && (
        <FormattedMessage
          id="ui-data-export.mappingProfiles.delete.confirmationModal.message"
          values={{ name: profile?.name }}
        />
      )}
    </Modal>
  );
};

MappingProfileDeleteModal.propTypes = {
  profile: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
