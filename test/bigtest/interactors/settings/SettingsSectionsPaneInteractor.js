import {
  interactor,
  Interactor,
  collection,
} from '@bigtest/interactor';

@interactor class SettingsSectionsPaneInteractor {
  profilesLabel = new Interactor('[data-test-profile-label]');
  sectionsLabels = collection('[data-test-settings-label] [class*=label--]');
  navigationItems = collection('[class*=pane--]:nth-child(2) [data-test-nav-list-item]');
}

export default SettingsSectionsPaneInteractor;
