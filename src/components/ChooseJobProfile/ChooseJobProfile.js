import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  JobProfiles,
  useJobProfilesProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  useListFormatter,
} from '@folio/stripes-data-transfer-components';

import { jobProfilesManifest } from '../../common';

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
  const [selectedProfile, setSelectedProfile] = useState({});
  const fileDefinitionIdRef = useRef(null);

  useEffect(() => {
    fileDefinitionIdRef.current = location.state?.fileDefinitionId;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <JobProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={useListFormatter({})}
        hasSearchForm={false}
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
        heading={<FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.title" />}
        message={(
          <SafeHTMLMessage
            id="ui-data-export.jobProfiles.selectProfile.modal.message"
            values={{ profile: selectedProfile.name }}
          />
        )}
        confirmLabel={<FormattedMessage id="ui-data-export.run" />}
        cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
        onCancel={() => setConfirmationModalState(false)}
        onConfirm={async () => {
          try {
            await mutator.export.POST({
              fileDefinitionId: fileDefinitionIdRef.current,
              jobProfileId: selectedProfile.id,
            });

            history.push('/data-export');
          } catch (error) {
            setConfirmationModalState(false);
            console.error(error);
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
