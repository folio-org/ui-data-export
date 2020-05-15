import {
  interactor,
  text,
  collection,
} from '@bigtest/interactor';

import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';

@interactor
export class FolioRecordTypeInteractor {
  defaultScope = '[data-test-folio-record-type]';

  label = text('[data-test-folio-record-type-label]');
  errorLabel = text('[data-test-folio-record-type-error]');
  checkboxes = collection('[data-test-checkbox]', CheckboxInteractor);
}
