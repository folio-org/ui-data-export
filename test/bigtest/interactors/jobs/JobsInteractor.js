import {
  interactor,
  Interactor,
  count,
  collection,
} from '@bigtest/interactor';

import JobsAccordionInteractor from './JobsAccordionInteractor';

@interactor
export class JobsInteractor {
  static defaultScope = '[data-test-jobs-pane]';

  container = new Interactor('[data-test-jobs-container]');
  accordions = collection('[data-test-accordion-section]', JobsAccordionInteractor);
  accordionsAmount = count('[data-test-accordion-section]');

  whenLoaded() {
    return this.when(() => this.isPresent);
  }
}
