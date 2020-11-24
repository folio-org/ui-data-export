import {
  interactor,
  collection,
  Interactor,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';

import { TransformationFieldGroupInteractor } from './TransformationFieldGroup';

@interactor
export class TransformationsInteractor {
  list = new MultiColumnListInteractor('#mapping-profiles-form-transformations');
  listEmpty = new Interactor('[data-test-list-empty]');
  valuesFields = collection('#mapping-profiles-form-transformations [data-testId="transformation-field-group"]', TransformationFieldGroupInteractor);
  checkboxes = collection('#mapping-profiles-form-transformations [data-row-inner] [data-test-checkbox]', CheckboxInteractor);
  selectAllCheckbox = new CheckboxInteractor('#mapping-profiles-form-transformations [data-header-row-inner] [data-test-checkbox]');
}
