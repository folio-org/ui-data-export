import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  Pane,
} from '@folio/stripes-components';

import { QueryFileUploader } from '../components';

export default function Home() {
  return (
    <Paneset>
      <Pane
        data-test-jobs-pane
        defaultWidth="320px"
        paneTitle={(
          <span data-test-title>
            <FormattedMessage id="ui-data-export.jobsPaneTitle" />
          </span>
        )}
      >
        <QueryFileUploader />
      </Pane>
      <Pane
        data-test-logs-pane
        defaultWidth="fill"
        paneTitle={(
          <span data-test-title>
            <FormattedMessage id="ui-data-export.logsPaneTitle" />
          </span>
        )}
      />
    </Paneset>
  );
}
