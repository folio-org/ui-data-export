import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor
export class TransformationsInteractor {
  list = new MultiColumnListInteractor('#mapping-profile-details-transformations');
  addButton = scoped('[data-test-add-button]', ButtonInteractor);
}
