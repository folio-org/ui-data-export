import { interactor } from '@bigtest/interactor';

import { PreloaderInteractor } from '@folio/stripes-data-transfer-components/interactors';

import { MappingProfilesFormInteractor } from '../../MappingProfilesForm/interactors/MappingProfilesFormInteractor';

@interactor
export class DuplicateMappingProfileRouteInteractor {
  preloader = new PreloaderInteractor();
  form = new MappingProfilesFormInteractor();
}
