import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route,
  Switch,
  stripesShape,
} from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

import { DataExportSettings } from './settings';
import Home from './routes/Home';
import ChooseJobProfile from './components/ChooseJobProfile';
import { ErrorLogsView } from './components/ErrorLogsView';

export default function DataExport(props) {
  const {
    showSettings,
    match: { path },
  } = props;

  if (showSettings) {
    return <DataExportSettings {...props} />;
  }

  return (
    <Switch>
      <Route
        path={path}
        exact
        component={Home}
      />
      <Route
        path={`${path}/job-logs`}
        component={() => (
          <Pane
            data-test-all-logs-pane
            defaultWidth="fill"
            paneTitle={(
              <span data-test-title>
                <FormattedMessage id="ui-data-export.logsPaneTitle" />
              </span>
            )}
          />
        )}
      />
      <Route
        path={`${path}/job-profile`}
        component={ChooseJobProfile}
      />
      <Route
        paty={`${path}/log/:id`}
        component={ErrorLogsView}
      />
    </Switch>
  );
}

DataExport.propTypes = {
  stripes: stripesShape.isRequired,
  match: matchShape.isRequired,
  showSettings: PropTypes.bool,
};

DataExport.defaultProps = { showSettings: false };
