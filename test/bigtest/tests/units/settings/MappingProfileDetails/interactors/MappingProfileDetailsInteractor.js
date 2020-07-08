import { interactor } from '@bigtest/interactor';

import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import MetaSectionInteractor from '@folio/stripes-components/lib/MetaSection/tests/interactor';
import {
  FullScreenViewInteractor,
  PreloaderInteractor,
} from '@folio/stripes-data-transfer-components/interactors';

import { ProfileDetailsActionMenuInteractor } from '../../../../../interactors';
import { SummaryContentInteractor } from './SummaryContentInteractor';
import { TransformationsInteractor } from './TransformationsInteractor';

@interactor
export class MappingProfileDetailsInteractor {
  defaultScope = '#mapping-profile-details';

  fullScreen = new FullScreenViewInteractor();
  expandAllButton = new ExpandAllButtonInteractor();
  accordions = new AccordionSetInteractor('#mapping-profile-details-accordions');
  summary = new SummaryContentInteractor();
  transformations = new TransformationsInteractor();
  preloader = new PreloaderInteractor();
  metadata = new MetaSectionInteractor();
  actionMenu = new ProfileDetailsActionMenuInteractor();
}
