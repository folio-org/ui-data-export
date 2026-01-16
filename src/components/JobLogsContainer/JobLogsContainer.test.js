import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useHistory } from 'react-router-dom';

import '../../../test/jest/__mock__';

import { JobLogsContainer } from './JobLogsContainer';
import { translationsProperties } from '../../../test/helpers';

jest.mock('./fetchFileDownloadLink');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({
    okapi: {
      url: 'https://folio-testing.dev.folio.org',
      tenant: 'diku',
      token: 'token',
    },
  })),
}), { virtual: true });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockRecord = {
  id: 'test-id-1',
  hrId: 1,
  jobProfileId: 'job-profile-id-1',
  jobProfileName: 'Test Job Profile',
  exportedFiles: [{ fileName: 'test-file.mrc' }],
  progress: {
    exported: 100,
    failed: 0,
    total: 100,
  },
  runBy: {
    firstName: 'John',
    lastName: 'Doe',
  },
  startedDate: '2024-01-15T10:00:00.000+0000',
  completedDate: '2024-01-15T10:05:00.000+0000',
  status: 'COMPLETED',
};

const mockDeletedRecord = {
  ...mockRecord,
  id: 'test-id-2',
  jobProfileId: null, // Deleted profile
  jobProfileName: 'Deleted Job Profile',
};

const mockInProgressRecord = {
  ...mockRecord,
  id: 'test-id-3',
  status: 'IN_PROGRESS',
};

const mockFailedRecord = {
  ...mockRecord,
  id: 'test-id-4',
  status: 'FAIL',
  progress: {
    exported: 50,
    failed: 50,
    total: 100,
  },
};

const mockNotExportedRecord = {
  ...mockRecord,
  id: 'test-id-5',
  progress: {
    exported: 0,
    failed: 0,
    total: 100,
  },
};

describe('JobLogsContainer', () => {
  let childrenMock;

  beforeEach(() => {
    childrenMock = jest.fn(props => {
      const { listProps } = props;
      const { resultsFormatter } = listProps;

      return (
        <div data-testid="job-logs-container">
          <div data-testid="completed-file">
            {resultsFormatter.fileName(mockRecord)}
          </div>
          <div data-testid="deleted-file">
            {resultsFormatter.fileName(mockDeletedRecord)}
          </div>
          <div data-testid="in-progress-file">
            {resultsFormatter.fileName(mockInProgressRecord)}
          </div>
          <div data-testid="failed-file">
            {resultsFormatter.fileName(mockFailedRecord)}
          </div>
          <div data-testid="not-exported-file">
            {resultsFormatter.fileName(mockNotExportedRecord)}
          </div>
          <div data-testid="job-profile-name">
            {resultsFormatter.jobProfileName(mockDeletedRecord)}
          </div>
          <div data-testid="status">
            {resultsFormatter.status(mockRecord)}
          </div>
        </div>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFileNameField formatter', () => {
    it('should render file name as clickable button for completed and exported records', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const completedFile = screen.getByTestId('completed-file');
      const button = completedFile.querySelector('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('test-file.mrc');
    });

    it('should render file name as disabled span for deleted job profile', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const deletedFile = screen.getByTestId('deleted-file');
      const span = deletedFile.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('test-file.mrc');
      expect(deletedFile.querySelector('button')).not.toBeInTheDocument();
    });

    it('should render file name as disabled span for in-progress jobs', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const inProgressFile = screen.getByTestId('in-progress-file');
      const span = inProgressFile.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('test-file.mrc');
      expect(inProgressFile.querySelector('button')).not.toBeInTheDocument();
    });

    it('should render file name as disabled span for failed jobs', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const failedFile = screen.getByTestId('failed-file');
      const span = failedFile.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('test-file.mrc');
      expect(failedFile.querySelector('button')).not.toBeInTheDocument();
    });

    it('should render file name as disabled span for not exported records', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const notExportedFile = screen.getByTestId('not-exported-file');
      const span = notExportedFile.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('test-file.mrc');
      expect(notExportedFile.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('jobProfileName formatter', () => {
    it('should display "(deleted)" suffix for deleted job profiles', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const jobProfileName = screen.getByTestId('job-profile-name');

      expect(jobProfileName).toHaveTextContent('Deleted Job Profile (ui-data-export.deleted)');
    });
  });

  describe('status formatter', () => {
    it('should format status correctly', () => {
      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const status = screen.getByTestId('status');

      expect(status).toHaveTextContent('ui-data-export.jobStatus.completed');
    });
  });

  describe('row click handler', () => {
    it('should navigate to job log detail for non-completed jobs with job profile', () => {
      const mockPush = jest.fn();
      useHistory.mockReturnValue({ push: mockPush });

      childrenMock = jest.fn(props => {
        const { onRowClick } = props;

        return (
          <div data-testid="job-logs-container">
            <button
              type="button"
              data-testid="row-button"
              onClick={(e) => onRowClick(e, mockInProgressRecord)}
            >
              Click Row
            </button>
          </div>
        );
      });

      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const rowButton = screen.getByTestId('row-button');
      userEvent.click(rowButton);

      expect(mockPush).toHaveBeenCalledWith(`/data-export/log/${mockInProgressRecord.id}`);
    });

    it('should not navigate for completed jobs', () => {
      const mockPush = jest.fn();
      useHistory.mockReturnValue({ push: mockPush });

      childrenMock = jest.fn(props => {
        const { onRowClick } = props;

        return (
          <div data-testid="job-logs-container">
            <button
              type="button"
              data-testid="row-button"
              onClick={(e) => onRowClick(e, mockRecord)}
            >
              Click Row
            </button>
          </div>
        );
      });

      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const rowButton = screen.getByTestId('row-button');
      userEvent.click(rowButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should not navigate for deleted job profiles', () => {
      const mockPush = jest.fn();
      useHistory.mockReturnValue({ push: mockPush });

      childrenMock = jest.fn(props => {
        const { onRowClick } = props;

        return (
          <div data-testid="job-logs-container">
            <button
              type="button"
              data-testid="row-button"
              onClick={(e) => onRowClick(e, mockDeletedRecord)}
            >
              Click Row
            </button>
          </div>
        );
      });

      renderWithIntl(
        <JobLogsContainer>
          {childrenMock}
        </JobLogsContainer>,
        translationsProperties
      );

      const rowButton = screen.getByTestId('row-button');
      userEvent.click(rowButton);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

