import {
  interactor,
  collection,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor
export class TransformationsInteractor {
  list = new MultiColumnListInteractor('#mapping-profiles-form-transformations');
  valuesFields = collection('#mapping-profiles-form-transformations [data-test-transformation-field]', TextFieldInteractor);
}
