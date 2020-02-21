import {
  interactor,
  text,
  triggerable,
  Interactor,
  is,
  isPresent,
} from '@bigtest/interactor';

import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class QueryFileUploaderInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  subTitle = text('[data-test-sub-title]');
  uploaderBtn = new Interactor('[data-test-upload-btn]');
  secondaryArea = new Interactor('[data-test-secondary-area]');
  triggerDragEnter = triggerable('dragenter');
  triggerDragLeave = triggerable('dragleave');
  triggerDrop = triggerable('drop');
  hasPreloader = isPresent('[data-test-preloader]');
  hasActiveClass = is('[class*="activeUpload---"]');
  callout = new CalloutInteractor();
}

export const queryFileUploaderInteractor = new QueryFileUploaderInteractor('[class*="upload---"]');
