import {
  interactor,
  scoped,
} from '@bigtest/interactor';

// TODO: get rid of this interactor in advance of adding these fields to the pane interactor in stripes-components
@interactor
export class PaneInteractor {
  headerTitle = scoped('[data-test-pane-header-title]');
  subHeaderTitle = scoped('[data-test-pane-header-sub]');
}
