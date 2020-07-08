import { interactor } from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor
export class ProfileDetailsActionMenuInteractor {
  editProfileButton = new ButtonInteractor('[data-test-edit-profile-button]');
  duplicateProfileButton = new ButtonInteractor('[data-test-duplicate-profile-button]');
  deleteProfileButton = new ButtonInteractor('[data-test-delete-profile-button]');
}
