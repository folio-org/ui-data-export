import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  screen,
  getByText,
  getByRole,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';

import { ChooseJobProfileComponent as ChooseJobProfile } from './ChooseJobProfile';
import { translationsProperties } from '../../../test/helpers';
import { renderWithIntl } from '../../../test/jest/helpers';

const resources = buildResources({
  resourceName: 'jobProfiles',
  records: [{
    id: 'jobProfile1',
    name: 'A Lorem ipsum 1',
    description: 'Description 1',
    userInfo: {
      firstName: 'Donald',
      lastName: 'S',
    },
    metadata: { updatedDate: '2018-12-04T09:05:30.000+0000' },
  },
  {
    id: 'jobProfile2',
    name: 'A Lorem ipsum 2',
    description: 'Description 2',
    userInfo: {
      firstName: 'Mark',
      lastName: 'K',
    },
    metadata: { updatedDate: '2018-11-04T11:22:31.000+0000' },
  }],
  hasLoaded: true,
});

describe('ChooseJobProfile', () => {
  describe('rendering ChooseJobProfile', () => {
    const exportProfileSpy = jest.fn(Promise.resolve.bind(Promise));
    const pushHistorySpy = jest.fn();
    const mutator = buildMutator({ export: { POST: exportProfileSpy } });
    const location = { state: { fileDefinitionId: 'fileDefinitionId' } };
    let renderResult;

    beforeEach(() => {
      renderResult = renderWithIntl(
        <Router>
          <ChooseJobProfile
            resources={resources}
            mutator={mutator}
            history={{ push: pushHistorySpy }}
            location={location}
          />
        </Router>,
        translationsProperties
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be visible', () => {
      const { container } = renderResult;

      expect(container.querySelector('#pane-results')).toBeVisible();
    });

    it('should display correct title and subtitle', () => {
      const { container } = renderResult;
      const paneHeader = container.querySelector('[data-test-pane-header]');

      expect(getByText(paneHeader, 'Select job profile to run the export')).toBeVisible();
      expect(getByText(paneHeader, '2 job profiles')).toBeVisible();
    });

    it('should place headers in correct order', () => {
      const { container } = renderResult;
      const headers = container.querySelectorAll('#search-results-list .mclHeader');

      expect(getByText(headers[0], 'Name')).toBeVisible();
      expect(getByText(headers[1], 'Description')).toBeVisible();
      expect(getByText(headers[2], 'Updated')).toBeVisible();
      expect(getByText(headers[3], 'Updated by')).toBeVisible();
    });

    it('should not display the confirmation modal', () => {
      const { container } = renderResult;
      const modal = container.querySelector('#choose-job-profile-confirmation-modal');

      expect(modal).not.toBeInTheDocument();
    });

    it('should display correct data for the first row', () => {
      const { container } = renderResult;
      const row = container.querySelector('.mclRow');
      const cells = row.querySelectorAll('.mclCell');

      expect(getByText(cells[0], 'A Lorem ipsum 1')).toBeVisible();
      expect(getByText(cells[1], 'Description 1')).toBeVisible();
      expect(getByText(cells[2], '12/4/2018')).toBeVisible();
      expect(getByText(cells[3], 'Donald S')).toBeVisible();
    });

    describe('clicking on row', () => {
      beforeEach(() => {
        const { container } = renderResult;
        const row = container.querySelector('.mclRow');

        userEvent.click(row);
      });

      it('should display modal with proper header', () => {
        expect(screen.getByText('Are you sure you want to run this job?')).toBeInTheDocument();
      });

      it('should display modal profile name in the body', () => {
        const bodyString = document.querySelector('[data-test-confirmation-modal-message]');

        expect(bodyString.innerHTML).toEqual('You have selected <b>A Lorem ipsum 1</b> to run the export');
      });

      it('should display modal with proper wording for buttons', () => {
        const modal = document.querySelector('#choose-job-profile-confirmation-modal');

        expect(getByRole(modal, 'button', { name: 'Run' })).toBeVisible();
        expect(getByRole(modal, 'button', { name: 'Cancel' })).toBeVisible();
      });

      it('clicking on cancel button should close the modal', () => {
        const modal = document.querySelector('#choose-job-profile-confirmation-modal');

        userEvent.click(getByRole(modal, 'button', { name: 'Cancel' }));

        return waitForElementToBeRemoved(() => document.querySelector('#choose-job-profile-confirmation-modal'));
      });

      describe('clicking on confirm button - success case', () => {
        beforeEach(() => {
          const modal = document.querySelector('#choose-job-profile-confirmation-modal');

          userEvent.click(getByRole(modal, 'button', { name: 'Run' }));
        });

        it('should initiate the export process by calling the API with correct params', () => {
          expect(exportProfileSpy).toHaveBeenCalledWith({
            fileDefinitionId: location.state.fileDefinitionId,
            jobProfileId: resources.jobProfiles.records[0].id,
          });
        });

        it('should navigate to the landing page', () => {
          expect(pushHistorySpy).toHaveBeenCalledWith('/data-export');
        });
      });

      describe('clicking on confirm button - error case', () => {
        beforeEach(async () => {
          const modal = document.querySelector('#choose-job-profile-confirmation-modal');

          exportProfileSpy.mockImplementationOnce(Promise.reject.bind(Promise));
          userEvent.click(getByRole(modal, 'button', { name: 'Run' }));
          await waitForElementToBeRemoved(() => document.querySelector('#choose-job-profile-confirmation-modal'));
        });

        it('should not navigate to the landing page', () => {
          expect(pushHistorySpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
