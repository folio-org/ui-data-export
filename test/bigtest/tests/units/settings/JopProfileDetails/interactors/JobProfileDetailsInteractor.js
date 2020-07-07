import { interactor } from '@bigtest/interactor';

import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import MetaSectionInteractor from '@folio/stripes-components/lib/MetaSection/tests/interactor';
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import {
  FullScreenViewInteractor,
  PreloaderInteractor,
} from '@folio/stripes-data-transfer-components/interactors';

import { SummaryContentInteractor } from './SummaryContentInteractor';

@interactor
export class JobProfileDetailsInteractor {
  defaultScope = '#job-profile-details';

  fullScreen = new FullScreenViewInteractor();
  accordions = new AccordionSetInteractor('#job-profile-details-accordions');
  summary = new SummaryContentInteractor();
  preloader = new PreloaderInteractor();
  metadata = new MetaSectionInteractor();
  editProfileButton = new ButtonInteractor('[data-test-edit-profile-button]');
  duplicateProfileButton = new ButtonInteractor('[data-test-duplicate-profile-button]');
  deleteProfileButton = new ButtonInteractor('[data-test-delete-profile-button]');
}
