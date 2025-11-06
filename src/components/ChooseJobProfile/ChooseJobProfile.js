import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  JobProfiles,
  useJobProfilesProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  useListFormatter,
} from '@folio/stripes-data-transfer-components';

import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import { jobProfilesManifest } from '../../common';
import { ListSelect } from './ChooseJobProfileSelect/ChooseJobProfileSelect';

const customProperties = {
  columnWidths: { description: '40%' },
  columnMapping: { description: 'ui-data-export.description' },
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
    'description',
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED,
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED_BY,
  ],
};

const ChooseJobProfileComponent = ({
  resources,
  mutator,
  history,
  location,
}) => {
  const [isConfirmationModalOpen, setConfirmationModalState] = useState(false);
  const [isJobRunning, setIsJobRunning] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [selectedRecordType, setSelectedRecordType] = useState('');
  const fileDefinitionIdRef = useRef(null);

  useEffect(() => {
    fileDefinitionIdRef.current = location.state?.fileDefinitionId;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInstanceIdType()) {
      setSelectedRecordType('');
    }
  }), [selectedProfile];

  const changeSelectHandler = event => {
    setSelectedProfile({
      ...selectedProfile,
      idType: event.target.value,
    });
  };

  const changeRecordSelectHandler = event => {
    setSelectedRecordType(event.target.value);
  };

  const isInstanceIdType = () => {
    return selectedProfile.idType === 'instance';
  };

  const isConfirmDisabled = () => {
    return !selectedProfile.idType ||
      (isInstanceIdType() && selectedRecordType === '')
      || isJobRunning;
  };

  return (
    <>
      <JobProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={useListFormatter({})}
        hasSearchForm
        lastMenu={<div />}
        titleId="ui-data-export.jobProfiles.selectProfile.title"
        searchResultsProps={{
          rowProps: null,
          onRowClick: (e, profile) => {
            setConfirmationModalState(true);
            setSelectedProfile(profile);
          },
        }}
        {...useJobProfilesProperties(customProperties)}
      />
      <ConfirmationModal
        id="choose-job-profile-confirmation-modal"
        open={isConfirmationModalOpen}
        disabledCofirmButton={isConfirmDisabled()}
        heading={<FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.title" />}
        message={(
          <div>
            <FormattedMessage
              id="ui-data-export.jobProfiles.selectProfile.modal.message"
              values={{ profile: selectedProfile.name }}
            />
            <ListSelect
              type="id"
              onChange={changeSelectHandler} />
            <ListSelect
              type="record"
              onChange={changeRecordSelectHandler}
              required={isInstanceIdType()}
              disabled={!isInstanceIdType()}
              value={selectedRecordType} />
          </div>
        )}
        confirmLabel={<FormattedMessage id="ui-data-export.run" />}
        cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
        onCancel={() => setConfirmationModalState(false)}
        onConfirm={async () => {
          try {
            setIsJobRunning(true);

            let requestBody = {
              fileDefinitionId: fileDefinitionIdRef.current,
              jobProfileId: selectedProfile.id,
              idType: selectedProfile.idType,
            };

            // Record type is which records to search - this is normally
            // implicit, to be the same as the identifier type, but it is
            // only used in an export request for the Linked Data case.
            // Leave it unset otherwise.
            if (selectedRecordType === 'LINKED_DATA') {
              requestBody.recordType = selectedRecordType;
            }

            await mutator.export.POST(requestBody);

            history.push('/data-export');
          } catch (error) {
            setConfirmationModalState(false);
          } finally {
            setIsJobRunning(false);
          }
        }}
      />
    </>
  );
};

ChooseJobProfileComponent.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ state: PropTypes.shape({ fileDefinitionId: PropTypes.string }) }).isRequired,
  mutator: PropTypes.shape({ export: PropTypes.shape({ POST: PropTypes.func.isRequired }) }).isRequired,
  resources: PropTypes.shape({}).isRequired,
};

ChooseJobProfileComponent.manifest = Object.freeze({
  ...jobProfilesManifest,
  export: {
    type: 'okapi',
    path: 'data-export/export',
    clientGeneratePk: false,
    throwErrors: false,
    fetch: false,
  },
});

export { ChooseJobProfileComponent };
export default stripesConnect(ChooseJobProfileComponent);
