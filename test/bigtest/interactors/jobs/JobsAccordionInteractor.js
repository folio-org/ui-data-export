import {
  interactor,
  scoped,
} from '@bigtest/interactor';

@interactor
export default class JobsAccordionInteractor {
  title = scoped('[data-test-jobs-accordion-title]');
}
