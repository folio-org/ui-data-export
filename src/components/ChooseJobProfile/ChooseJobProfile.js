import React, { useState, useEffect } from 'react';
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
import { useMappingProfile } from '../../hooks/useMappingProfile';
import { useRunDataExport } from '../../hooks/useRunDataExport';
import { RECORD_TYPE_TO_RUN_JOB_PROFILE_MAPPING } from '../../utils';

const customProperties = {
  columnWidths: { description: '40%' },
  columnMapping: { description: 'ui-data-export.description' },
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
    'description',
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED,
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED_BY,
    DEFAULT_JOB_PROFILES_COLUMNS.LOCKED,
  ],
};

const ChooseJobProfileComponent = ({ resources, mutator, history, location }) => {
  const searchParams = new URLSearchParams(location.search);
  const fileDefinitionId = searchParams.get('fileDefinitionId');
  const [isConfirmationModalOpen, setConfirmationModalState] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const { runDataExport, isDataExportLoading } = useRunDataExport();
  const { mappingProfile } = useMappingProfile(selectedProfile.mappingProfileId);

  const changeSelectHandler = (event) => {
    setSelectedProfile({
      ...selectedProfile,
      idType: event.target.value,
    });
  };

  // Set default record type if the selected profile is default to skip modal selection
  useEffect(() => {
    const recordType = mappingProfile?.recordTypes?.[0];
    const idType = RECORD_TYPE_TO_RUN_JOB_PROFILE_MAPPING[recordType];

    if (selectedProfile.default && recordType && isConfirmationModalOpen) {
      setSelectedProfile((prevState) => ({
        ...prevState,
        idType,
      }));
    }
  }, [selectedProfile.default, mappingProfile, isConfirmationModalOpen]);

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
        disabledCofirmButton={!selectedProfile.idType || isDataExportLoading}
        heading={<FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.title" />}
        message={
          <div>
            <FormattedMessage
              id="ui-data-export.jobProfiles.selectProfile.modal.message"
              values={{ profile: selectedProfile.name }}
            />
            {!selectedProfile.default && <ListSelect onChange={changeSelectHandler} />}
          </div>
        }
        confirmLabel={<FormattedMessage id="ui-data-export.run" />}
        cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
        onCancel={() => setConfirmationModalState(false)}
        onConfirm={async () => {
          try {
            await runDataExport({
              fileDefinitionId,
              jobProfileId: selectedProfile.id,
              idType: selectedProfile.idType,
            });

            history.push('/data-export');
          } catch (error) {
            setConfirmationModalState(false);
          }
        }}
      />
    </>
  );
};

ChooseJobProfileComponent.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  mutator: PropTypes.shape({ export: PropTypes.shape({ POST: PropTypes.func.isRequired }) }).isRequired,
  resources: PropTypes.shape({}).isRequired,
};

ChooseJobProfileComponent.manifest = Object.freeze(jobProfilesManifest);

export { ChooseJobProfileComponent };
export default stripesConnect(ChooseJobProfileComponent);
