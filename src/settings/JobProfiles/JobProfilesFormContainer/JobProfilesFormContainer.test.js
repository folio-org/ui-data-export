import React from 'react';
import { screen, render } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import '../../../../test/jest/__new_mock__';

import { useStripes } from '@folio/stripes/core';
import JobProfilesFormContainer from './JobProfilesFormContainer';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

jest.mock(
  '@folio/stripes-components/lib/Layer',
  () => props => props.children
);

const mappingProfilesMock = [
  { value: 'mapping_1', label: 'mapping 1' },
  { value: 'mapping_2', label: 'mapping 2' },
];

const jobProfileMock = {
  id: 'profile-1',
  name: 'Test Profile',
  description: 'Test Description',
  mappingProfileId: 'mapping_1',
  locked: false,
  metadata: {
    createdDate: '2023-01-01',
    updatedDate: '2023-01-02',
  },
};

const defaultProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  hasLoaded: true,
  mappingProfiles: mappingProfilesMock,
};

const renderContainer = (props = {}) => {
  render(<JobProfilesFormContainer {...defaultProps} {...props} />);
};

describe('JobProfilesFormContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStripes.mockReturnValue({
      hasPerm: jest.fn().mockReturnValue(true),
    });
  });

  describe('Permission checking', () => {
    it('should call stripes.hasPerm with correct permission', () => {
      const hasPerm = jest.fn().mockReturnValue(true);

      useStripes.mockReturnValue({ hasPerm });

      renderContainer({ mode: 'newProfile' });

      expect(hasPerm).toHaveBeenCalledWith('ui-data-export.settings.lock');
    });

    it('should pass hasLockPermissions=true to form when user has permission', () => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(true),
      });

      renderContainer({ mode: 'newProfile' });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeEnabled();
    });

    it('should pass hasLockPermissions=false to form when user lacks permission', () => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(false),
      });

      renderContainer({ mode: 'newProfile' });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeDisabled();
    });
  });

  describe('New profile mode', () => {
    it('should render form with correct title', () => {
      renderContainer({ mode: 'newProfile' });

      expect(screen.getByText(/jobProfiles.newProfile/)).toBeInTheDocument();
    });

    it('should set locked=true by default when user has lock permissions', () => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(true),
      });

      renderContainer({ mode: 'newProfile' });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeChecked();
    });

    it('should set locked=false by default when user lacks lock permissions', () => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(false),
      });

      renderContainer({ mode: 'newProfile' });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).not.toBeChecked();
    });
  });

  describe('Edit profile mode', () => {
    it('should render form with correct title', () => {
      renderContainer({
        mode: 'editProfile',
        jobProfile: jobProfileMock,
      });

      expect(screen.getByText(/jobProfiles.editProfile/)).toBeInTheDocument();
    });

    it('should render profile headline', () => {
      renderContainer({
        mode: 'editProfile',
        jobProfile: jobProfileMock,
      });

      expect(screen.getByTestId('headline')).toHaveTextContent('Test Profile');
    });

    it('should preserve existing lock status', () => {
      const lockedProfile = { ...jobProfileMock, locked: true };

      renderContainer({
        mode: 'editProfile',
        jobProfile: lockedProfile,
      });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeChecked();
    });
  });

  describe('Duplicate profile mode', () => {
    it('should render form with new profile title', () => {
      renderContainer({
        mode: 'duplicateProfile',
        jobProfile: jobProfileMock,
      });

      expect(screen.getByText(/jobProfiles.newProfile/)).toBeInTheDocument();
    });

    it('should always set locked=false for duplicated profiles', () => {
      const lockedProfile = { ...jobProfileMock, locked: true };

      renderContainer({
        mode: 'duplicateProfile',
        jobProfile: lockedProfile,
      });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).not.toBeChecked();
    });

    it('should set locked=false even when user has lock permissions', () => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(true),
      });

      const lockedProfile = { ...jobProfileMock, locked: true };

      renderContainer({
        mode: 'duplicateProfile',
        jobProfile: lockedProfile,
      });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).not.toBeChecked();
    });

    it('should prefix profile name with "Copy of"', () => {
      renderContainer({
        mode: 'duplicateProfile',
        jobProfile: jobProfileMock,
      });

      const nameField = screen.getByRole('textbox', { name: /name/ });

      expect(nameField).toHaveValue('copyOf Test Profile');
    });
  });

  describe('Form props', () => {
    it('should pass hasLoaded prop to form', () => {
      renderContainer({ hasLoaded: false });

      expect(screen.getByTestId('preloader')).toBeInTheDocument();
    });

    it('should pass mappingProfiles to form', () => {
      renderContainer({ mode: 'newProfile' });

      const mappingProfileField = screen.getByRole('combobox', { name: /mappingProfile/ });

      expect(mappingProfileField).toBeInTheDocument();
    });

    it('should pass onSubmit and onCancel handlers', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();

      renderContainer({ onSubmit, onCancel, mode: 'newProfile' });

      expect(screen.getByRole('button', { name: /saveAndClose/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/ })).toBeInTheDocument();
    });
  });
});
