import React from 'react';
import { screen } from '@testing-library/react';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';
import '../../../../test/jest/__new_mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { runAxeTest } from '@folio/stripes-testing';

import JobProfilesFormContainer from './JobProfilesFormContainer';
import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';

jest.mock('../JobProfilesForm', () => ({
  JobProfilesForm: jest.fn(props => (
    <div data-testid="job-profiles-form">
      <div data-testid="pane-title">{props.paneTitle}</div>
      <div data-testid="has-lock-permissions">{String(props.hasLockPermissions)}</div>
      <div data-testid="initial-values">{JSON.stringify(props.initialValues)}</div>
      {props.metadata && <div data-testid="metadata">metadata</div>}
      {props.headLine && <div data-testid="headline">headline</div>}
    </div>
  )),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({
    hasPerm: jest.fn(perm => perm === 'ui-data-export.settings.lock'),
  })),
}));

const mappingProfilesMock = [
  { value: 'mapping_1', label: 'mapping 1' },
  { value: 'mapping_2', label: 'mapping 2' },
];

describe('JobProfilesFormContainer', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: noop,
    mappingProfiles: mappingProfilesMock,
    hasLoaded: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('newProfile mode', () => {
    it('should render with correct pane title', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.getByTestId('pane-title')).toHaveTextContent('ui-data-export.jobProfiles.newProfile');
    });

    it('should set locked to true in initial values when user has lock permissions', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);
      expect(initialValues.locked).toBe(true);
    });

    it('should pass hasLockPermissions prop correctly', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.getByTestId('has-lock-permissions')).toHaveTextContent('true');
    });

    it('should not render metadata or headline', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.queryByTestId('metadata')).not.toBeInTheDocument();
      expect(screen.queryByTestId('headline')).not.toBeInTheDocument();
    });

    it('should render with no axe errors', async () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      await runAxeTest({
        rootNode: document.body,
      });
    });
  });

  describe('editProfile mode', () => {
    it('should render with correct pane title translation key', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      const paneTitleElement = screen.getByTestId('pane-title');
      expect(paneTitleElement).toBeInTheDocument();
      expect(paneTitleElement.textContent).toBeTruthy();
    });

    it('should format initial values from job profile', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);

      expect(initialValues.id).toBe(jobProfile.id);
      expect(initialValues.name).toBe(jobProfile.name);
      expect(initialValues.description).toBe(jobProfile.description);
      expect(initialValues.mappingProfileId).toBe(jobProfile.mappingProfileId);

      expect(initialValues.metadata).toBeUndefined();
      expect(initialValues.userInfo).toBeUndefined();
      expect(initialValues.default).toBeUndefined();
    });

    it('should render metadata component', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      expect(screen.getByTestId('metadata')).toBeInTheDocument();
    });

    it('should render headline with job profile name', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      expect(screen.getByTestId('headline')).toBeInTheDocument();
    });

    it('should pass all required props to JobProfilesForm', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      expect(screen.getByTestId('job-profiles-form')).toBeInTheDocument();
      expect(screen.getByTestId('has-lock-permissions')).toHaveTextContent('true');
    });

    it('should render with no axe errors', async () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="editProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      await runAxeTest({
        rootNode: document.body,
      });
    });
  });

  describe('duplicateProfile mode', () => {
    it('should render with new profile pane title', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      expect(screen.getByTestId('pane-title')).toHaveTextContent('ui-data-export.jobProfiles.newProfile');
    });

    it('should format initial values without id field', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);

      expect(initialValues.id).toBeUndefined();
      expect(initialValues.description).toBe(jobProfile.description);
      expect(initialValues.mappingProfileId).toBe(jobProfile.mappingProfileId);
    });

    it('should set locked to false in initial values', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);
      expect(initialValues.locked).toBe(false);
    });

    it('should have name in initial values for duplicate', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);
      expect(initialValues.name).toBeTruthy();
    });

    it('should not render metadata or headline', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      expect(screen.queryByTestId('metadata')).not.toBeInTheDocument();
      expect(screen.queryByTestId('headline')).not.toBeInTheDocument();
    });

    it('should render with no axe errors', async () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="duplicateProfile"
          jobProfile={jobProfile}
        />,
        translationsProperties
      );

      await runAxeTest({
        rootNode: document.body,
      });
    });
  });

  describe('user without lock permissions', () => {
    it('should set hasLockPermissions based on stripes permissions', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.getByTestId('has-lock-permissions')).toBeInTheDocument();
    });
  });

  describe('prop forwarding', () => {
    it('should render JobProfilesForm with correct props', () => {
      renderWithIntl(
        <JobProfilesFormContainer
          {...defaultProps}
          hasLoaded={false}
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.getByTestId('job-profiles-form')).toBeInTheDocument();
    });

    it('should pass through all props to JobProfilesForm', () => {
      const onSubmitMock = jest.fn();
      const onCancelMock = jest.fn();

      renderWithIntl(
        <JobProfilesFormContainer
          onSubmit={onSubmitMock}
          onCancel={onCancelMock}
          mappingProfiles={mappingProfilesMock}
          hasLoaded
          mode="newProfile"
        />,
        translationsProperties
      );

      expect(screen.getByTestId('job-profiles-form')).toBeInTheDocument();
      expect(screen.getByTestId('has-lock-permissions')).toBeInTheDocument();
      expect(screen.getByTestId('initial-values')).toBeInTheDocument();
    });
  });
});
