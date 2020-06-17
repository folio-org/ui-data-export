import {
  interactor,
  collection,
} from '@bigtest/interactor';

import {
  ProfilesPopoverInteractor,
  ProfilesLabelInteractor,
} from '@folio/stripes-data-transfer-components/interactors';

@interactor class SettingsSectionsPaneInteractor {
  profilesLabel = new ProfilesLabelInteractor();
  profilesPopover = new ProfilesPopoverInteractor();
  sectionsLabels = collection('[data-test-settings-label] [class*=label--]');
  navigationItems = collection('[class*=pane--]:nth-child(2) [data-test-nav-list-item]');
}

export default SettingsSectionsPaneInteractor;
