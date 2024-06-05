import React from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route,
  Switch,
  stripesShape,
} from '@folio/stripes/core';

import { DataExportSettings } from './settings';
import Home from './routes/Home';
import ChooseJobProfile from './components/ChooseJobProfile';
import { ErrorLogsView } from './components/ErrorLogsView';
import { AllJobLogsView } from './components/AllJobLogsView';

export default function DataExport(props) {
  const {
    showSettings = false,
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
        component={AllJobLogsView}
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
