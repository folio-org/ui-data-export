import {
  interactor,
  Interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import { TransformationsInteractor } from './TransformationsInteractor';

@interactor
export class TransformationsModalInteractor {
  static defaultScope = '[data-test-transformations-modal]';

  searchPane = new Interactor('[data-test-transformations-search-pane]');
  collapseSearchPaneButton = new Interactor('[data-test-collapse-filter-pane-button]');
  expandSearchPaneButton = new Interactor('[data-test-expand-filter-pane-button]');
  resultsPane = new Interactor('[data-test-transformations-results-pane]');
  filterAccordions = new AccordionSetInteractor('#transformations-filter-accordions');
  searchField = new TextFieldInteractor('[data-test-transformations-search-field]');
  recordTypeCheckboxes = collection('#transformations-record-type-accordion [data-test-checkbox]', CheckboxInteractor);
  totalSelected = new Interactor('[data-test-transformations-total-selected]');
  saveButton = new ButtonInteractor('[data-test-transformations-save]');
  resetButton = new ButtonInteractor('[data-test-transformations-reset]');
  cancelButton = new ButtonInteractor('[data-test-transformations-cancel]');
  transformations = new TransformationsInteractor();
}
