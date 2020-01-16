import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';

export function DataExportSettings(props) {
  const sections = [];

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
