import React, {
  useEffect,
  useRef,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import {
  stripesShape,
  stripesConnect,
  TitleManager,
} from '@folio/stripes/core';
import {
  ProfilesLabel,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import { Callout } from '@folio/stripes/components';

import PropTypes from 'prop-types';
import { MappingProfilesContainer } from '../MappingProfiles/MappingProfilesContainer';
import { JobProfilesContainer } from '../JobProfiles/JobProfilesContainer';
import { CalloutContext } from '../../contexts/CalloutContext';

const getSettingsLabel = (messageId, iconKey) => {
  return (
    <SettingsLabel
      messageId={`ui-data-export.${messageId}`}
      iconKey={iconKey}
    />
  );
};



export function DataExportSettings(props) {
  const calloutRef = useRef(null);
  const paneTitleRef = useRef(null);
  const intl = useIntl();

  const sections = [
    {
      label:
  <TitleManager page={intl.formatMessage({ id: 'ui-data-export.settings.index.managerTitle' })}>
    <ProfilesLabel
      link="https://wiki.folio.org/x/AyUuAg"
      content={<FormattedMessage id="ui-data-export.settings.profilesInfo" />}
    />
  </TitleManager>,
      pages: [
        {
          route: 'job-profiles',
          label: getSettingsLabel('jobProfilesTitle', 'jobProfiles'),
          component: stripesConnect(JobProfilesContainer),
        },
        {
          route: 'mapping-profiles',
          label: getSettingsLabel('mappingProfilesTitle', 'mappingProfiles'),
          component: stripesConnect(MappingProfilesContainer),
        },
      ],
    },
  ];

  useEffect(() => {
    if (paneTitleRef.current) {
      paneTitleRef.current.focus();
    }
  }, []);

  return (
    <>
      <CalloutContext.Provider value={calloutRef.current}>
        <Settings
          {...props}
          navPaneWidth="15%"
          sections={sections}
          paneTitle={<FormattedMessage id="ui-data-export.settings.index.paneTitle" />}
          paneTitleRef={paneTitleRef}
        />
      </CalloutContext.Provider>
      <Callout ref={calloutRef} />
    </>
  );
}

DataExportSettings.propTypes = { stripes: stripesShape.isRequired, location: PropTypes.object };
