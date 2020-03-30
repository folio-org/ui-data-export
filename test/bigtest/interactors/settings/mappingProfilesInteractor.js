import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import { SearchFormInteractor } from '@folio/stripes-data-transfer-components/interactors';

@interactor class MappingProfilesInteractor {
  static defaultScope = '[data-test-mapping-profiles-pane]';

  searchForm = new SearchFormInteractor();
  paneTitle = scoped('[data-test-settings-label]');
}

export const mappingProfilesInteractor = new MappingProfilesInteractor();
