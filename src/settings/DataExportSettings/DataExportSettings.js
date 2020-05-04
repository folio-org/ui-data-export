import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';
import {
  ProfilesLabel,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';

import { MappingProfilesContainer } from '../MappingProfiles/MappingProfilesContainer';
import { JobProfilesContainer } from '../JobProfiles/JobProfilesContainer';

const getSettingsLabel = (messageId, iconKey) => {
  return (
    <SettingsLabel
      messageId={`ui-data-export.${messageId}`}
      iconKey={iconKey}
    />
  );
};

const sections = [
  {
    label: <ProfilesLabel
      link="https://wiki.folio.org/display/FOLIOtips/Creating+and+using+profiles"
      content={<div style={{ width: '150px' }} />}
    />,
    pages: [
      {
        route: 'job-profiles',
        label: getSettingsLabel('jobProfilesTitle', 'jobProfiles'),
        component: JobProfilesContainer,
      },
      {
        route: 'mapping-profiles',
        label: getSettingsLabel('mappingProfilesTitle', 'mappingProfiles'),
        component: MappingProfilesContainer,
      },
    ],
  },
];

export function DataExportSettings(props) {
  return (
    <Settings
      {...props}
      navPaneWidth="15%"
      sections={sections}
      paneTitle={<FormattedMessage id="ui-data-export.settings.index.paneTitle" />}
    />
  );
}

DataExportSettings.propTypes = { stripes: stripesShape.isRequired };
