import {
  interactor,
  Interactor,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

import { PaneInteractor } from '../../../../../interactors';
import { TransformationsInteractor } from './TransformationsInteractor';
import { TransformationsSearchFormInteractor } from './TransformationsSearchFormInteractor';

@interactor
export class TransformationsModalInteractor {
  static defaultScope = '[data-test-transformations-modal]';

  searchPane = new PaneInteractor('[data-test-transformations-search-pane]');
  collapseSearchPaneButton = new Interactor('[data-test-collapse-filter-pane-button]');
  expandSearchPaneButton = new Interactor('[data-test-expand-filter-pane-button]');
  searchForm = new TransformationsSearchFormInteractor();
  resultsPane = new PaneInteractor('[data-test-transformations-results-pane]');
  transformations = new TransformationsInteractor();
  totalSelected = new Interactor('[data-test-transformations-total-selected]');
  saveButton = new ButtonInteractor('[data-test-transformations-save]');
  cancelButton = new ButtonInteractor('[data-test-transformations-cancel]');
}
