import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

@interactor
export class TransformationsSearchFormInteractor {
  static defaultScope = '[data-test-transformations-search-form]';

  searchField = new TextFieldInteractor('[data-test-transformations-search-form-field]');
  filterAccordions = new AccordionSetInteractor('#transformations-filter-accordions');
  recordTypeFilters = collection('#transformations-record-type-accordion [data-test-checkbox]', CheckboxInteractor);
  statusFilters = collection('#transformations-status-accordion [data-test-checkbox]', CheckboxInteractor);
  resetButton = new ButtonInteractor('[data-test-transformations-search-form-reset]');

  submit() {
    return this.trigger('submit');
  }
}
