import { interactor } from '@bigtest/interactor';

import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import { FullScreenFormInteractor } from '@folio/stripes-data-transfer-components/interactors';

import { SummaryContentInteractor } from './SummaryContentInteractor';
import { TransformationsInteractor } from './TransformationsInteractor';

@interactor
export class MappingProfilesFormInteractor {
  defaultScope = '#mapping-profiles-form';

  fullScreen = new FullScreenFormInteractor();
  expandAllButton = new ExpandAllButtonInteractor();
  accordions = new AccordionSetInteractor('#mapping-profiles-form-accordions');
  summary = new SummaryContentInteractor();
  transformations = new TransformationsInteractor();
}
