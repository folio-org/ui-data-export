import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { cleanup } from '@bigtest/react';
import {
  describe,
  beforeEach,
  it,
  before,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { noop } from 'lodash';

import { Paneset } from '@folio/stripes/components';
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { JobProfileDetails } from '../../../../../../src/settings/JobProfiles/JobProfileDetails';
import { JobProfileDetailsInteractor } from './interactors/JobProfileDetailsInteractor';
import { mappingProfile } from '../../../../network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../network/scenarios/fetch-job-profiles-success';

describe('JobProfileDetails', () => {
  const jobProfileDetails = new JobProfileDetailsInteractor();
  const stripes = {
    connect: Component => props => (
      <Component
        {... props}
        mutator={{}}
        resources={{}}
      />
    ),
  };

  before(async () => {
    await cleanup();
  });

  describe('rendering details for a job profile which is already in use', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfileDetails
              stripes={stripes}
              jobProfile={jobProfile}
              mappingProfile={mappingProfile}
              isProfileAlreadyInUse
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display job profile details', () => {
      expect(jobProfileDetails.isPresent).to.be.true;
    });

    it('should display shared full screen view elements', () => {
      expect(jobProfileDetails.fullScreen.isPresent).to.be.true;
    });

    it('should display correct pane title', () => {
      expect(jobProfileDetails.fullScreen.headerTitle).to.equal(jobProfile.name);
    });

    it('should display accordions set', () => {
      expect(jobProfileDetails.accordions.isPresent).to.be.true;
    });

    it('should display metadata section', () => {
      expect(jobProfileDetails.metadata.isPresent).to.be.true;
    });

    it('should display correct metadata values', () => {
      expect(jobProfileDetails.metadata.createdText).to.equal('Record created: 12/4/2018 11:22 AM');
      expect(jobProfileDetails.metadata.updatedText).to.equal('Record last updated: 12/4/2018 1:28 PM');
    });

    it('should display correct summary fields labels', () => {
      expect(jobProfileDetails.summary.name.label.text).to.equal(commonTranslations.name);
      expect(jobProfileDetails.summary.description.label.text).to.equal(translations.description);
      expect(jobProfileDetails.summary.protocol.label.text).to.equal(translations.protocol);
      expect(jobProfileDetails.summary.mappingProfile.label.text).to.equal(translations.mappingProfile);
    });

    it('should display correct summary fields values', () => {
      expect(jobProfileDetails.summary.name.value.text).to.equal(jobProfile.name);
      expect(jobProfileDetails.summary.description.value.text).to.equal(jobProfile.description);
      expect(jobProfileDetails.summary.protocol.value.text).to.equal('-');
      expect(jobProfileDetails.summary.mappingProfile.value.text).to.equal(mappingProfile.name);
    });

    describe('clicking on action menu button', () => {
      beforeEach(async () => {
        await jobProfileDetails.fullScreen.actionMenu.click();
      });

      it('should display action buttons in the proper state', () => {
        expect(jobProfileDetails.editProfileButton.$root.disabled).to.be.true;
        expect(jobProfileDetails.duplicateProfileButton.$root.disabled).to.be.false;
        expect(jobProfileDetails.deleteProfileButton.$root.disabled).to.be.true;
      });
    });
  });

  describe('rendering details without description for a job profile which is not already in use', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfileDetails
              stripes={stripes}
              jobProfile={{
                ...jobProfile,
                description: null,
              }}
              mappingProfile={mappingProfile}
              isProfileAlreadyInUse={false}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display no value in description', () => {
      expect(jobProfileDetails.summary.description.value.text).to.equal('-');
    });

    describe('clicking on action menu button', () => {
      beforeEach(async () => {
        await jobProfileDetails.fullScreen.actionMenu.click();
      });

      it('should display action buttons enabled', () => {
        expect(jobProfileDetails.editProfileButton.$root.disabled).to.be.false;
        expect(jobProfileDetails.duplicateProfileButton.$root.disabled).to.be.false;
        expect(jobProfileDetails.deleteProfileButton.$root.disabled).to.be.false;
      });
    });
  });

  describe('rendering job profile details in loading state', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfileDetails
              stripes={stripes}
              isLoading
              isProfileAlreadyInUse
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });
});
