import { BrowserRouter as Router } from 'react-router-dom';
import { screen, getByText, getByRole, getByTestId, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';

import { buildResources, buildMutator } from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { runAxeTest } from '@folio/stripes-testing';
import { ChooseJobProfileComponent as ChooseJobProfile } from './ChooseJobProfile';
import { translationsProperties } from '../../../test/helpers';

import { useRunDataExport } from '../../hooks/useRunDataExport';
import { useMappingProfile } from '../../hooks/useMappingProfile';

jest.mock('../../hooks/useRunDataExport', () => ({
  useRunDataExport: jest.fn(),
}));

jest.mock('../../hooks/useMappingProfile', () => ({
  useMappingProfile: jest.fn(),
}));

const resources = buildResources({
  resourceName: 'jobProfiles',
  records: [
    {
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
    },
  ],
  hasLoaded: true,
});

describe('ChooseJobProfile', () => {
  describe('rendering ChooseJobProfile', () => {
    const pushHistorySpy = jest.fn();
    const mutator = buildMutator({ export: { POST: jest.fn() } });
    const location = { search: '?fileDefinitionId=fileDefinitionId' };

    let renderResult;
    let runDataExportMock;

    beforeEach(() => {
      jest.clearAllMocks();

      runDataExportMock = jest.fn().mockResolvedValue({});

      useRunDataExport.mockReturnValue({
        runDataExport: runDataExportMock,
        isDataExportLoading: false,
      });

      useMappingProfile.mockReturnValue({
        mappingProfile: null,
      });

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

    it('should render with no axe errors', async () => {
      const { container } = renderResult;

      await runAxeTest({
        rootNode: container,
      });
    });

    it('should display correct title and subtitle', () => {
      const { container } = renderResult;
      const paneHeader = container.querySelector('[data-test-pane-header]');

      expect(getByText(paneHeader, 'ui-data-export.jobProfiles.selectProfile.title')).toBeVisible();
      expect(getByText(paneHeader, 'ui-data-export.jobProfiles.selectProfile.title')).toBeVisible();
    });

    it('should place headers in correct order', () => {
      const { container } = renderResult;
      const headers = container.querySelectorAll('#search-results-list .mclHeader');

      expect(getByText(headers[0], 'stripes-data-transfer-components.name')).toBeVisible();
      expect(getByText(headers[1], 'ui-data-export.description')).toBeVisible();
      expect(getByText(headers[2], 'stripes-data-transfer-components.updated')).toBeVisible();
      expect(getByText(headers[3], 'stripes-data-transfer-components.updatedBy')).toBeVisible();
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
      expect(getByText(cells[2], '2018-12-04')).toBeVisible();
      expect(getByText(cells[3], 'Donald S')).toBeVisible();
    });

    describe('clicking on row', () => {
      beforeEach(async () => {
        const { container } = renderResult;
        const row = container.querySelector('.mclRow');

        await userEvent.click(row);
      });

      it('should display modal with proper header', () => {
        expect(screen.getByText('ui-data-export.jobProfiles.selectProfile.modal.title')).toBeInTheDocument();
      });

      it('should display modal profile name in the body', () => {
        expect(screen.getByTestId('choose-job-select')).toBeVisible();
      });

      it('should display modal with proper wording for buttons', () => {
        const modal = document.querySelector('#choose-job-profile-confirmation-modal');

        expect(getByRole(modal, 'button', { name: 'ui-data-export.run' })).toBeVisible();
        expect(getByRole(modal, 'button', { name: 'ui-data-export.cancel' })).toBeVisible();
      });

      it('clicking on cancel button should close the modal', async () => {
        const modal = document.querySelector('#choose-job-profile-confirmation-modal');

        await userEvent.click(getByRole(modal, 'button', { name: 'ui-data-export.cancel' }));

        await waitFor(() => {
          expect(document.querySelector('#choose-job-profile-confirmation-modal')).not.toBeInTheDocument();
        });
      });

      describe('clicking on confirm button - success case', () => {
        it('should call runDataExport with proper payload and navigate to the landing page', async () => {
          const modal = document.querySelector('#choose-job-profile-confirmation-modal');

          await userEvent.selectOptions(getByTestId(modal, 'choose-job-select'), 'ui-data-export.instance');

          await userEvent.click(getByRole(modal, 'button', { name: 'ui-data-export.run' }));

          await waitFor(() => {
            expect(runDataExportMock).toHaveBeenCalledTimes(1);
          });

          const payload = runDataExportMock.mock.calls[0][0];

          expect(payload.fileDefinitionId).toBe('fileDefinitionId');
          expect(payload.jobProfileId).toBe('jobProfile1');
          expect(payload.idType).toBeTruthy();

          expect(pushHistorySpy).toHaveBeenCalledWith('/data-export');
        });
      });

      describe('clicking on confirm button - error case', () => {
        beforeEach(() => {
          runDataExportMock.mockReset();
          runDataExportMock.mockRejectedValue(new Error('export failed'));
        });

        it('should not navigate to the landing page and should close the modal', async () => {
          const modal = document.querySelector('#choose-job-profile-confirmation-modal');

          await userEvent.selectOptions(getByTestId(modal, 'choose-job-select'), 'ui-data-export.instance');

          await userEvent.click(getByRole(modal, 'button', { name: 'ui-data-export.run' }));

          // wait for the catch block to run and close modal
          await waitFor(() => {
            expect(pushHistorySpy).not.toHaveBeenCalled();
            expect(document.querySelector('#choose-job-profile-confirmation-modal')).not.toBeInTheDocument();
          });
        });
      });
    });
  });
});
