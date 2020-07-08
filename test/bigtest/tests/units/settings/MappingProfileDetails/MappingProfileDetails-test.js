import React from 'react';
import { cleanup } from '@bigtest/react';
import {
  describe,
  beforeEach,
  it,
  before,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { noop } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';

import { Paneset } from '@folio/stripes/components';
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { MappingProfileDetails } from '../../../../../../src/settings/MappingProfiles/MappingProfileDetails';
import { MappingProfileDetailsInteractor } from './interactors/MappingProfileDetailsInteractor';
import {
  mappingProfileWithTransformations,
  mappingProfile,
} from '../../../../network/scenarios/fetch-mapping-profiles-success';

describe('MappingProfileDetails', () => {
  const mappingProfileDetails = new MappingProfileDetailsInteractor();
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

  describe('rendering details for a mapping profile which is already in use', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <MappingProfileDetails
              stripes={stripes}
              mappingProfile={mappingProfileWithTransformations}
              isDefaultProfile
              isProfileUsed
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display mapping profile details', () => {
      expect(mappingProfileDetails.isPresent).to.be.true;
    });

    it('should display shared full screen view elements', () => {
      expect(mappingProfileDetails.fullScreen.isPresent).to.be.true;
    });

    it('should display correct pane title', () => {
      expect(mappingProfileDetails.fullScreen.headerTitle).to.equal(mappingProfileWithTransformations.name);
    });

    it('should display expand all button', () => {
      expect(mappingProfileDetails.expandAllButton.isPresent).to.be.true;
    });

    it('should display accordions set', () => {
      expect(mappingProfileDetails.accordions.isPresent).to.be.true;
    });

    it('should display metadata section', () => {
      expect(mappingProfileDetails.metadata.isPresent).to.be.true;
    });

    it('should display correct metadata values', () => {
      expect(mappingProfileDetails.metadata.createdText).to.equal('Record created: 12/4/2018 1:29 AM');
      expect(mappingProfileDetails.metadata.updatedText).to.equal('Record last updated: 12/4/2018 1:29 AM');
    });

    it('should display summary section fields', () => {
      expect(mappingProfileDetails.summary.name.isPresent).to.be.true;
      expect(mappingProfileDetails.summary.description.isPresent).to.be.true;
      expect(mappingProfileDetails.summary.recordType.isPresent).to.be.true;
      expect(mappingProfileDetails.summary.outputFormat.isPresent).to.be.true;
    });

    it('should display correct summary fields labels', () => {
      expect(mappingProfileDetails.summary.name.label.text).to.equal(commonTranslations.name);
      expect(mappingProfileDetails.summary.description.label.text).to.equal(translations.description);
      expect(mappingProfileDetails.summary.recordType.label.text).to.equal(commonTranslations.folioRecordType);
      expect(mappingProfileDetails.summary.outputFormat.label.text).to.equal(translations.outputFormat);
    });

    it('should display correct summary fields values', () => {
      expect(mappingProfileDetails.summary.name.value.text).to.equal('AP Holdings 1');
      expect(mappingProfileDetails.summary.description.value.text).to.equal('AP Holdings 1 description');
      expect(mappingProfileDetails.summary.recordType.value.text).to.equal(commonTranslations['recordTypes.holdings']);
      expect(mappingProfileDetails.summary.outputFormat.value.text).to.equal('MARC');
    });

    it('should display correct transformations fields headers', () => {
      expect(mappingProfileDetails.transformations.list.headers(0).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(mappingProfileDetails.transformations.list.headers(1).text).to.equal(translations['mappingProfiles.transformations.transformation']);
    });

    it('should display correct transformations values', () => {
      expect(mappingProfileDetails.transformations.list.rows(0).cells(0).text).to.equal('Holdings - Call number');
      expect(mappingProfileDetails.transformations.list.rows(0).cells(1).text).to.equal('test');
    });

    describe('clicking on action menu button', () => {
      beforeEach(async () => {
        await mappingProfileDetails.fullScreen.actionMenu.click();
      });

      it('should display action buttons in the proper state', () => {
        expect(mappingProfileDetails.actionMenu.editProfileButton.$root.disabled).to.be.true;
        expect(mappingProfileDetails.actionMenu.duplicateProfileButton.$root.disabled).to.be.false;
        expect(mappingProfileDetails.actionMenu.deleteProfileButton.$root.disabled).to.be.true;
      });
    });
  });

  describe('rendering details for a mapping profile which is not already in use', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <MappingProfileDetails
              stripes={stripes}
              mappingProfile={mappingProfile}
              isDefaultProfile={false}
              isProfileUsed={false}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display no value in description', () => {
      expect(mappingProfileDetails.summary.description.value.text).to.equal('-');
    });

    it('should not display transformation list', () => {
      expect(mappingProfileDetails.transformations.list.isPresent).to.be.false;
    });

    describe('clicking on action menu button', () => {
      beforeEach(async () => {
        await mappingProfileDetails.fullScreen.actionMenu.click();
      });

      it('should display action buttons enabled', () => {
        expect(mappingProfileDetails.actionMenu.editProfileButton.$root.disabled).to.be.false;
        expect(mappingProfileDetails.actionMenu.duplicateProfileButton.$root.disabled).to.be.false;
        expect(mappingProfileDetails.actionMenu.deleteProfileButton.$root.disabled).to.be.false;
      });
    });
  });

  describe('rendering mapping profile details  in loading state', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Paneset>
          <Router>
            <MappingProfileDetails
              stripes={stripes}
              isLoading
              isDefaultProfile={false}
              isProfileUsed
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display preloader', () => {
      expect(mappingProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });
});
