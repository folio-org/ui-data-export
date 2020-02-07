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
    </Switch>
  );
}

DataExport.propTypes = {
  stripes: stripesShape.isRequired,
  match: matchShape.isRequired,
  showSettings: PropTypes.bool,
};

DataExport.defaultProps = { showSettings: false };
