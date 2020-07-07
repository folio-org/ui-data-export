import { interactor } from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

@interactor
export class TransformationsInteractor {
  list = new MultiColumnListInteractor('#mapping-profile-details-transformations');
}
