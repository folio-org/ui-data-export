import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';

import { useStripes } from '@folio/stripes/core';
import { ProfileDetailsActionMenu } from './ProfileDetailsActionMenu';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

const defaultProps = {
  isProfileUsed: false,
  isDefaultProfile: false,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggle: jest.fn(),
  onDuplicate: jest.fn(),
};

const renderActionMenu = (props = {}) => {
  render(<ProfileDetailsActionMenu {...defaultProps} {...props} />);
};

describe('ProfileDetailsActionMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStripes.mockReturnValue({
      hasPerm: jest.fn().mockReturnValue(true),
    });
  });

  describe('User with lock permissions', () => {
    it('should render all action buttons for unlocked profile', () => {
      renderActionMenu();

      expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-profile-button')).toBeInTheDocument();
    });

    it('should hide edit and delete buttons for default profile', () => {
      renderActionMenu({ isDefaultProfile: true });

      expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should hide edit and delete buttons for locked (in-use) profile', () => {
      renderActionMenu({ isProfileUsed: true });

      expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should call onEdit and onToggle when edit button is clicked', () => {
      const onEdit = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onEdit, onToggle });

      userEvent.click(screen.getByTestId('edit-profile-button'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete and onToggle when delete button is clicked', () => {
      const onDelete = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onDelete, onToggle });

      userEvent.click(screen.getByTestId('delete-profile-button'));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onDuplicate and onToggle when duplicate button is clicked', () => {
      const onDuplicate = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onDuplicate, onToggle });

      userEvent.click(screen.getByTestId('duplicate-profile-button'));

      expect(onDuplicate).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('User without lock permissions', () => {
    beforeEach(() => {
      useStripes.mockReturnValue({
        hasPerm: jest.fn().mockReturnValue(false),
      });
    });

    it('should hide edit and delete buttons for any profile', () => {
      renderActionMenu();

      expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should only show duplicate button for locked profile', () => {
      renderActionMenu({ isProfileUsed: true });

      expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should only show duplicate button for default profile', () => {
      renderActionMenu({ isDefaultProfile: true });

      expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('duplicate-profile-button')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-profile-button')).not.toBeInTheDocument();
    });
  });

  describe('Permission checking', () => {
    it('should call stripes.hasPerm with correct permission', () => {
      const hasPerm = jest.fn().mockReturnValue(true);

      useStripes.mockReturnValue({ hasPerm });

      renderActionMenu();

      expect(hasPerm).toHaveBeenCalledWith('ui-data-export.settings.lock');
    });
  });
});
