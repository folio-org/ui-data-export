import {
  interactor,
  collection,
} from '@bigtest/interactor';

import { SearchAndSortInteractor } from '@folio/stripes-data-transfer-components/interactors';

@interactor class AllLogsPaneInteractor {
  searchAndSort = new SearchAndSortInteractor();
  fileNameBtns = collection('[data-test-download-file-btn]');
}

export const allLogsPaneInteractor = new AllLogsPaneInteractor();
