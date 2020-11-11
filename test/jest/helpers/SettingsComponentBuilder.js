import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Paneset } from '@folio/stripes-components';
import { CalloutContext } from '@folio/stripes-core';
import { noop } from 'lodash';

import { OverlayContainer } from '../../helpers';

export const SettingsComponentBuilder = ({
  children,
  sendCallout = noop,
}) => {
  return (
    <Router>
      <OverlayContainer />
      <Paneset>
        <CalloutContext.Provider value={{ sendCallout }}>
          {children}
        </CalloutContext.Provider>
      </Paneset>
    </Router>
  );
};
