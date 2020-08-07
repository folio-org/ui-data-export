## Code style guide

Most of the code style guide is handled by the eslint [config](./.eslintrc). However, there are conventions which are not managed by it and should be checked during the code review:


### General

#### Git commit message
Every commit message should be done in the following format:
```
<JIRA issue number>: <Commit message>
```
Note, that dot at the end of the commit message should not be used. Message should be formed by using present simple tense (not past simple).
 
Example:
```
UIDEXP-50: Add mapping profile details
```

#### Changlelog message

Every PR should contain changes to the [CHANGELOG.md](./CHANGELOG.md) file. Changelog entry should be added at the end of the release changelog which is already in the progress. If there is no such release, the one should be created and only there the changelog entry should be added. Usually the message is pretty similar for the chosen commit message for the PR, but the format is different:
```
<Changelog message>. <JIRA issue number>.
```

Example:
```
Add mapping profile details. UIDEXP-50.
```

The usage of dots is required.

#### Order of imports

The order of imports should be the following:

- third-party imports
- @folio imports
- local imports
- CSS imports

After each import group an empty line should be added.

Example:
```
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { Accordion } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { ProfileDetails } from '../../ProfileDetails';
import { mappingProfileTransformations } from '../MappingProfilesTransformationsModal/TransformationsField/transformations';
import { mappingProfileShape } from './shapes';

import css from './MappingProfileDetails.css';

...
```

#### Ordering of destructuring parameters

Functions should be listed at the end of the destructuring list.

Example where `match` and `onCancel` are functions:
```
const MappingProfileDetailsRoute = ({
  resources: {
    mappingProfile,
    jobProfiles,
  },
  mutator: { mappingProfile: { DELETE } },
  match,
  onCancel,
}) => {
```

#### Module export notation

Named export should be used, not default.

Example:
```
export { TransformationsForm } from './TransformationsForm';
```

#### Boolean props/variables naming

Boolean props/variables should start with `is`.

Example: `isLoading` rather than `loading`.

#### Naming of the callback props

When it comes to choosing the callback prop for the component the naming for it should follow the format `on<Event_Name>`.

Example:
```
JobProfilesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};
```

Note, that in the example above, the `handleSubmit` is not following this convention as *react-final-form* provides it in the specified format, so this is a valid exception.

#### Naming of the callback props provided to the child component

When it is about to providing the calback as a prop to a child component there are  multiple cases how to deal with it:
- in case the callback prop is taken from props and does not need any wrapper, then it should be passed as is (e.g. `onCancel` and `handleSubmit` in the example below);
- in case the callback prop is taken from props (e.g. `onProfileChange` in the example below) and does need a wrapper, then the wrapper name for it should be `handle<Prop_Name>`, where `Prop_Name` should come without verb part of the prop name (e.g. `on` or `handle`) at the beginning (e.g. `handleProfileChange` in the example below).

Example:
```
const {
 handleSubmit,
 onCancel,
 onProfileChange,
} = props;

const handleProfileChange = () => {
  ...

  onProfileChange();

  ...
};

const handleDescriptionChange = () => {
  ...
};

<JobProfilesForm
  onSubmit={handleSubmit}
  onProfileChange={handleProfileChange}
  onCancel={onCancel}
/>
```


### Tests

#### `describe` and `it` messages in tests

When it comes to test the particular component or function it is okay to name the first describe with the name of it. The descendant `describe` blocks should be formed with present continuous tense. `it` block should start with `should` word.

Example:
```
describe('MappingProfileDetails', () => {

  describe('rendering details for a mapping profile which is already in use', () => {

    it('should display mapping profile details', () => {

      describe('clicking on action menu button', () => {

        it('should display action buttons in the proper state', () => {
```

#### Approach for creating test setup functions/components

For reusability purposes it is a good practice to create functions/components to set up a component for testing by varying arguments/props to achieve different scenarios. When in order to set up component no wrapper react component needed, then function approach should be used with the name `setup<Component_Name>`. In the example below `Component_Name` is `JobProfileDetailsRoute` and thus test wrapper component name is `setupJobProfileDetailsRoute`.

Example:
```
async function setupJobProfileDetailsRoute({
  resources,
  matchParams = {},
  history = {},
} = {}) {
  await mountWithContext(
    <Paneset>
      <Router>
        <JobProfileDetailsRoute
          resources={resources}
          mutator={{ jobProfile: { DELETE: noop } }}
          history={history}
          location={{}}
          match={{ params: matchParams }}
        />
      </Router>
    </Paneset>,
    translationsProperties,
  );
}
```

When in order to set up component the wrapper react component is needed (e.g. when component deals with hooks) then it should be done by the component approach with the name `<Component_Name>Container`. In the example below `Component_Name` is `JobProfiles` and thus test wrapper component name is `JobProfilesContainer`.

Example:
```
const JobProfilesContainer = ({
  parentResources = {},
  customProperties = {},
  customListProperties,
  customListFormatters,
}) => (
  <Router>
    <JobProfiles
      parentMutator={parentMutator}
      parentResources={parentResources}
      formatter={useListFormatter(customListFormatters)}
      {...useJobProfilesProperties(customListProperties)}
      {...customProperties}
    />
  </Router>
);
```
