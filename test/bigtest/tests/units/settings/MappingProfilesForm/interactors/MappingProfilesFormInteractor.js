import { interactor } from '@bigtest/interactor';

import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import { FullScreenFormInteractor } from '@folio/stripes-data-transfer-components/interactors';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import { SummaryContentInteractor } from './SummaryContentInteractor';
import { TransformationsModalInteractor } from './TransformationsModalInteractor';

@interactor
export class MappingProfilesFormInteractor {
  defaultScope = '#mapping-profiles-form';

  fullScreen = new FullScreenFormInteractor();
  expandAllButton = new ExpandAllButtonInteractor();
  addTransformationsButton = new ButtonInteractor('[data-test-add-transformations]');
  accordions = new AccordionSetInteractor('#mapping-profiles-form-accordions');
  summary = new SummaryContentInteractor();
  transformations = new MultiColumnListInteractor('#mapping-profile-transformations-list');
  transformationsModal = new TransformationsModalInteractor();
}
