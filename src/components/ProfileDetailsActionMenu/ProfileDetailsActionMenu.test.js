import React from 'react';
import { screen, render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';

import { runAxeTest } from '@folio/stripes-testing';
import { useStripes } from '@folio/stripes/core';

import { ProfileDetailsActionMenu } from './ProfileDetailsActionMenu';

// eslint-disable-next-line react-hooks/rules-of-hooks
const mockStripes = useStripes();

const defaultProps = {
  isProfileUsed: false,
  isDefaultProfile: false,
  isLockedProfile: false,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggle: jest.fn(),
  onDuplicate: jest.fn(),
};

const getByDataTest = (testId) => document.querySelector(`[data-test-${testId}="true"]`);
const queryByDataTest = (testId) => document.querySelector(`[data-test-${testId}="true"]`);

const renderActionMenu = (props = {}) => {
  return render(<ProfileDetailsActionMenu {...defaultProps} {...props} />);
};

describe('ProfileDetailsActionMenu', () => {
  beforeEach(() => {
    // Default: user has all permissions
    mockStripes.hasPerm.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should render all action buttons for unlocked profile', () => {
    renderActionMenu();

    expect(getByDataTest('edit-profile-button')).toBeInTheDocument();
    expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
    expect(getByDataTest('delete-profile-button')).toBeInTheDocument();
  });

  it('should display correct labels for all buttons', () => {
    renderActionMenu();

    expect(screen.getByText('stripes-data-transfer-components.edit')).toBeInTheDocument();
    expect(screen.getByText('stripes-data-transfer-components.duplicate')).toBeInTheDocument();
    expect(screen.getByText('stripes-data-transfer-components.delete')).toBeInTheDocument();
  });

  it('should hide edit and delete buttons for default profile', () => {
    renderActionMenu({ isDefaultProfile: true });

    expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
    expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
    expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
  });

  it('should hide edit and delete buttons for locked (in-use) profile', () => {
    renderActionMenu({ isProfileUsed: true });

    expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
    expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
    expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
  });

  it('should call onEdit and onToggle when edit button is clicked', () => {
    const onEdit = jest.fn();
    const onToggle = jest.fn();

    renderActionMenu({ onEdit, onToggle });

    userEvent.click(getByDataTest('edit-profile-button'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete and onToggle when delete button is clicked', () => {
    const onDelete = jest.fn();
    const onToggle = jest.fn();

    renderActionMenu({ onDelete, onToggle });

    userEvent.click(getByDataTest('delete-profile-button'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDuplicate and onToggle when duplicate button is clicked', () => {
    const onDuplicate = jest.fn();
    const onToggle = jest.fn();

    renderActionMenu({ onDuplicate, onToggle });

    userEvent.click(getByDataTest('duplicate-profile-button'));

    expect(onDuplicate).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should render with no axe errors', async () => {
    renderActionMenu();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render buttons with correct styles', () => {
    renderActionMenu();

    const editButton = getByDataTest('edit-profile-button');
    const duplicateButton = getByDataTest('duplicate-profile-button');
    const deleteButton = getByDataTest('delete-profile-button');

    expect(editButton).toHaveAttribute('type', 'button');
    expect(duplicateButton).toHaveAttribute('type', 'button');
    expect(deleteButton).toHaveAttribute('type', 'button');
  });

  it('should display icons for all buttons', () => {
    renderActionMenu();

    expect(getByDataTest('edit-profile-button')).toHaveTextContent('stripes-data-transfer-components.edit');
    expect(getByDataTest('duplicate-profile-button')).toHaveTextContent('stripes-data-transfer-components.duplicate');
    expect(getByDataTest('delete-profile-button')).toHaveTextContent('stripes-data-transfer-components.delete');
  });

  describe('Locked profile behavior', () => {
    it('should show edit and duplicate buttons for locked profile when user has lock permissions', () => {
      mockStripes.hasPerm.mockImplementation(perm => perm === 'ui-data-export.settings.lock.edit');

      renderActionMenu({ isLockedProfile: true });

      expect(getByDataTest('edit-profile-button')).toBeInTheDocument();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
      expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should only show duplicate button for locked profile when user does not have lock permissions', () => {
      mockStripes.hasPerm.mockReturnValue(false);

      renderActionMenu({ isLockedProfile: true });

      expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
      expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should always hide delete button for locked profiles, even for authorized users', () => {
      mockStripes.hasPerm.mockImplementation(perm => perm === 'ui-data-export.settings.lock.edit');

      renderActionMenu({ isLockedProfile: true });

      expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should allow duplicate action for locked profile', () => {
      const onDuplicate = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ isLockedProfile: true, onDuplicate, onToggle });

      userEvent.click(getByDataTest('duplicate-profile-button'));

      expect(onDuplicate).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should allow edit action for locked profile when user has lock permissions', () => {
      mockStripes.hasPerm.mockImplementation(perm => perm === 'ui-data-export.settings.lock.edit');

      const onEdit = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ isLockedProfile: true, onEdit, onToggle });

      userEvent.click(getByDataTest('edit-profile-button'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should render with no axe errors when profile is locked', async () => {
      renderActionMenu({ isLockedProfile: true });

      await runAxeTest({
        rootNode: document.body,
      });
    });
  });

  describe('Button click handlers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should execute callbacks in correct order for edit action', () => {
      const callOrder = [];
      const onEdit = jest.fn(() => callOrder.push('edit'));
      const onToggle = jest.fn(() => callOrder.push('toggle'));

      renderActionMenu({ onEdit, onToggle });

      userEvent.click(getByDataTest('edit-profile-button'));

      expect(callOrder).toEqual(['edit', 'toggle']);
    });

    it('should execute callbacks in correct order for delete action', () => {
      const callOrder = [];
      const onDelete = jest.fn(() => callOrder.push('delete'));
      const onToggle = jest.fn(() => callOrder.push('toggle'));

      renderActionMenu({ onDelete, onToggle });

      userEvent.click(getByDataTest('delete-profile-button'));

      expect(callOrder).toEqual(['delete', 'toggle']);
    });

    it('should execute callbacks in correct order for duplicate action', () => {
      const callOrder = [];
      const onDuplicate = jest.fn(() => callOrder.push('duplicate'));
      const onToggle = jest.fn(() => callOrder.push('toggle'));

      renderActionMenu({ onDuplicate, onToggle });

      userEvent.click(getByDataTest('duplicate-profile-button'));

      expect(callOrder).toEqual(['duplicate', 'toggle']);
    });

    it('should not call handler if not provided', () => {
      const onToggle = jest.fn();

      renderActionMenu({ onToggle });

      userEvent.click(getByDataTest('duplicate-profile-button'));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should handle both isDefaultProfile and isProfileUsed being true', () => {
      renderActionMenu({
        isDefaultProfile: true,
        isProfileUsed: true,
      });

      expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
      expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should only show duplicate button when all conditions restrict editing', () => {
      renderActionMenu({
        isDefaultProfile: true,
        isProfileUsed: true,
        isLockedProfile: true,
      });

      expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
      expect(queryByDataTest('delete-profile-button')).not.toBeInTheDocument();
    });

    it('should show all buttons for regular profile that is not locked', () => {
      renderActionMenu({
        isDefaultProfile: false,
        isProfileUsed: false,
        isLockedProfile: false,
      });

      expect(getByDataTest('edit-profile-button')).toBeInTheDocument();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
      expect(getByDataTest('delete-profile-button')).toBeInTheDocument();
    });
  });

  describe('Button interactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should not call handlers multiple times on single click', () => {
      const onEdit = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onEdit, onToggle });

      userEvent.click(getByDataTest('edit-profile-button'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple sequential clicks correctly', () => {
      const onDuplicate = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onDuplicate, onToggle });

      const duplicateButton = getByDataTest('duplicate-profile-button');

      userEvent.click(duplicateButton);
      userEvent.click(duplicateButton);

      expect(onDuplicate).toHaveBeenCalledTimes(2);
      expect(onToggle).toHaveBeenCalledTimes(2);
    });

    it('should call different handlers independently', () => {
      const onEdit = jest.fn();
      const onDuplicate = jest.fn();
      const onToggle = jest.fn();

      renderActionMenu({ onEdit, onDuplicate, onToggle });

      userEvent.click(getByDataTest('edit-profile-button'));
      userEvent.click(getByDataTest('duplicate-profile-button'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onDuplicate).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component rendering', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should render without errors', () => {
      expect(() => renderActionMenu()).not.toThrow();
    });

    it('should always render duplicate button', () => {
      renderActionMenu();
      expect(getByDataTest('duplicate-profile-button')).toBeInTheDocument();
    });

    it('should conditionally render edit button based on multiple factors', () => {
      const { unmount: unmount1 } = renderActionMenu({
        isDefaultProfile: false,
        isProfileUsed: false,
      });
      expect(getByDataTest('edit-profile-button')).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderActionMenu({
        isDefaultProfile: true,
        isProfileUsed: false,
      });
      expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
      unmount2();

      renderActionMenu({
        isDefaultProfile: false,
        isProfileUsed: true,
      });
      expect(queryByDataTest('edit-profile-button')).not.toBeInTheDocument();
    });

    it('should match button visibility with delete button for unlocked profiles', () => {
      renderActionMenu();

      const editButtonExists = queryByDataTest('edit-profile-button') !== null;
      const deleteButtonExists = queryByDataTest('delete-profile-button') !== null;

      expect(editButtonExists).toBe(deleteButtonExists);
    });

    it('should show edit button but hide delete button for locked profiles when user has permissions', () => {
      mockStripes.hasPerm.mockImplementation(perm => perm === 'ui-data-export.settings.lock.edit');

      renderActionMenu({ isLockedProfile: true });

      const editButtonExists = queryByDataTest('edit-profile-button') !== null;
      const deleteButtonExists = queryByDataTest('delete-profile-button') !== null;

      expect(editButtonExists).toBe(true);
      expect(deleteButtonExists).toBe(false);
    });
  });
});
