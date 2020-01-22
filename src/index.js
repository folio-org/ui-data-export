import React from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route,
  Switch,
  stripesShape,
} from '@folio/stripes/core';

import { DataExportSettings } from './settings';

const Home = React.lazy(() => import('./routes/Home'));

export default function DataExport(props) {
  const {
    showSettings,
    match: { path },
  } = props;

  if (showSettings) {
    return <DataExportSettings {...props} />;
  }

  return (
    <React.Suspense fallback={null}>
      <Switch>
        <Route
          path={path}
          exact
          component={Home}
        />
      </Switch>
    </React.Suspense>
  );
}

DataExport.propTypes = {
  stripes: stripesShape.isRequired,
  match: matchShape.isRequired,
  showSettings: PropTypes.bool,
};

DataExport.defaultProps = { showSettings: false };
