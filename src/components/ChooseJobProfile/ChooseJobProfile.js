import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  JobProfiles,
  getJobProfilesColumnProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  getJobProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import { manifest as jobProfilesManifest } from './manifest';

export const customProperties = getJobProfilesColumnProperties({
  columnWidths: { description: '40%' },
  columnMapping: { description: <FormattedMessage id="ui-data-export.description" /> },
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
    'description',
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED,
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED_BY,
  ],
});

export const formatter = getJobProfilesItemFormatter({});

const ChooseJobProfile = ({
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
        formatter={formatter}
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
        {...customProperties}
      />
      <ConfirmationModal
        id="choose-job-profile-confirmation-modal"
        open={isConfirmationModalOpen}
        heading={<FormattedMessage id="ui-data-export.jobProfiles.selectProfile.modal.title" />}
        message={(
          <SafeHTMLMessage
            id="ui-data-export.jobProfiles.selectProfile.modal.message"
            values={{ profile: <b>{selectedProfile.name}</b> }}
          />
        )}
        confirmLabel={<FormattedMessage id="ui-data-export.run" />}
        cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
        onConfirm={async () => {
          try {
            await mutator.export.POST({
              fileDefinitionId: fileDefinitionIdRef.current,
              jobProfileId: selectedProfile.id,
            });

            history.push('/data-export');
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
          }
        }}
        onCancel={() => setConfirmationModalState(false)}
      />
    </>
  );
};

ChooseJobProfile.propTypes = {
  history: historyShape.isRequired,
  location: locationShape.isRequired,
  mutator: PropTypes.shape({ export: PropTypes.shape({ POST: PropTypes.func.isRequired }) }).isRequired,
  resources: PropTypes.shape({}).isRequired,
};

ChooseJobProfile.manifest = Object.freeze({
  ...jobProfilesManifest,
  export: {
    type: 'okapi',
    path: 'data-export/export',
    clientGeneratePk: false,
    throwErrors: false,
    fetch: false,
  },
});

export { ChooseJobProfile };
export default stripesConnect(ChooseJobProfile);
