import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import '../../../../test/jest/__new_mock__';

import { runAxeTest } from '@folio/stripes-testing';
import JobProfilesForm from './JobProfilesForm';

jest.mock(
  '@folio/stripes-components/lib/Layer',
  () => props => props.children
);

const mappingProfilesMock = [
  { value: 'mapping_1', label: 'mapping 1' },
  { value: 'mapping_2', label: 'mapping 2' },
];

const onSubmitMock = jest.fn();

const renderJobProfileForm = ({
  onCancel = jest.fn(),
  handleSubmit = onSubmitMock,
  pristine,
  submitting,
  hasLoaded = true,
  mappingProfiles = mappingProfilesMock,
  hasLockPermissions = true,
  renderWithDefault,
} = {}) => {
  const props = {
    onSubmit: handleSubmit,
    pristine,
    submitting,
    ...(!renderWithDefault && {
      onCancel,
      hasLoaded,
      mappingProfiles,
      hasLockPermissions,
    }),
  };
  render(
    <MemoryRouter>
      <JobProfilesForm {...props} />
    </MemoryRouter>
  );
};

describe('JobProfilesForm', () => {
  it('should submit form if required fields are filled', () => {
    renderJobProfileForm();

    const nameField = screen.getByRole('textbox', { name: /name/ });
    const mappingProfileField = screen.getByRole('combobox', { name: /mappingProfile/ });
    const mappingOptions = screen.getByRole('option', { name: 'mapping 1' });

    userEvent.type(nameField, 'test name');
    userEvent.selectOptions(mappingProfileField, mappingOptions);
    userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));

    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('should show validation exception if not all required fields are filled', () => {
    renderJobProfileForm();

    const nameField = screen.getByRole('textbox', { name: /name/ });

    userEvent.type(nameField, 'test name');
    userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));

    expect(screen.getByText(/validation.enterValue/)).toBeVisible();
  });

  it('should render preloader when render with default props', async () => {
    renderJobProfileForm({
      renderWithDefault: true,
    });

    const preloader = await screen.findByTestId('preloader');

    expect(preloader).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    renderJobProfileForm({
      renderWithDefault: true,
    });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  describe('Lock profile checkbox', () => {
    it('should render lock profile checkbox', () => {
      renderJobProfileForm();

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeInTheDocument();
    });

    it('should enable lock checkbox when user has lock permissions', () => {
      renderJobProfileForm({ hasLockPermissions: true });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeEnabled();
    });

    it('should disable lock checkbox when user does not have lock permissions', () => {
      renderJobProfileForm({ hasLockPermissions: false });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).toBeDisabled();
    });

    it('should allow user to check lock checkbox when authorized', () => {
      renderJobProfileForm({ hasLockPermissions: true });

      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      expect(lockCheckbox).not.toBeChecked();

      userEvent.click(lockCheckbox);

      expect(lockCheckbox).toBeChecked();
    });

    it('should submit form with lock field value', () => {
      renderJobProfileForm({ hasLockPermissions: true });

      const nameField = screen.getByRole('textbox', { name: /name/ });
      const mappingProfileField = screen.getByRole('combobox', { name: /mappingProfile/ });
      const mappingOptions = screen.getByRole('option', { name: 'mapping 1' });
      const lockCheckbox = screen.getByRole('checkbox', { name: /locked/ });

      userEvent.type(nameField, 'test name');
      userEvent.selectOptions(mappingProfileField, mappingOptions);
      userEvent.click(lockCheckbox);
      userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));

      expect(onSubmitMock).toHaveBeenCalled();
    });
  });
});
