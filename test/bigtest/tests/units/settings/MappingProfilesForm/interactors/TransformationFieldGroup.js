import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor
export class TransformationFieldGroupInteractor {
  marcField = scoped('[data-testId="transformation-marcField"]', TextFieldInteractor);
  indicator1 = scoped('[data-testId="transformation-indicator1"]', TextFieldInteractor);
  indicator2 = scoped('[data-testId="transformation-indicator2"]', TextFieldInteractor);
  subfield = scoped('[data-testId="transformation-subfield"]', TextFieldInteractor);
}
