import React from 'react';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { CreateJobProfileRoute } from '.';

import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { checkJobProfileFormState } from '../test/setup';

const history = [];

const setupCreateJobProfileRoute = ({
  matchParams = {},
  location = {
    search: '?location',
  },
} = {}) => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <CreateJobProfileRoute
        mutator={{ jobProfile: { POST: noop } }}
        history={history}
        resources={{
          mappingProfiles: {
            hasLoaded: true,
            records: [],
          },
        }}
        location={location}
        match={{ params: matchParams }}
        onSubmit={noop}
        onCancel={noop}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('CreateJobProfile', () => {
  describe('rendering details for a job profile without mapping profile data', () => {
    it('should display correct form state', async () => {
      setupCreateJobProfileRoute();

      const form = await screen.findByTestId('full-screen-form');

      await checkJobProfileFormState(form, {
        title: 'ui-data-export.jobProfiles.newProfile',
        isTCPIPEnabled: true,
      });
    });
    it('should render with no axe errors', async () => {
      setupCreateJobProfileRoute();

      await runAxeTest({
        rootNode: document.body,
      });
    });
  });
});
