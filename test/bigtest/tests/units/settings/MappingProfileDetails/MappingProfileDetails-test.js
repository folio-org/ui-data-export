import React from 'react';
import { useIntl } from 'react-intl';
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
import {
  mountWithContext,
  wait,
} from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { MappingProfileDetails } from '../../../../../../src/settings/MappingProfiles/MappingProfileDetails';
import { MappingProfileDetailsInteractor } from './interactors/MappingProfileDetailsInteractor';
import {
  mappingProfileWithTransformations,
  mappingProfile as mappingProfileWithoutTransformations,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../network/scenarios/fetch-mapping-profiles-success';

function MappingProfileDetailsContainer({
  allTransformations = [],
  mappingProfile = mappingProfileWithTransformations,
  isDefaultProfile = false,
  isProfileUsed = false,
  isLoading = false,
  onCancel = noop,
  onEdit = noop,
  onDelete = noop,
} = {}) {
  const stripes = {
    connect: Component => props => (
      <Component
        {... props}
        mutator={{}}
        resources={{}}
      />
    ),
  };

  const intl = useIntl();

  return (
    <Paneset>
      <Router>
        <MappingProfileDetails
          isLoading={isLoading}
          allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
          stripes={stripes}
          mappingProfile={mappingProfile}
          isDefaultProfile={isDefaultProfile}
          isProfileUsed={isProfileUsed}
          onCancel={onCancel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Router>
    </Paneset>
  );
}

describe('MappingProfileDetails', () => {
  const mappingProfileDetails = new MappingProfileDetailsInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering details for a mapping profile which is already in use', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MappingProfileDetailsContainer
          isDefaultProfile
          isProfileUsed
          allTransformations={allMappingProfilesTransformations}
        />,
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
      expect(mappingProfileDetails.transformations.list.rows(0).cells(0).text).to.equal('Holdings - Call number - Call number');
      expect(mappingProfileDetails.transformations.list.rows(0).cells(1).$root.textContent).to.equal('$900  1');
      expect(mappingProfileDetails.transformations.list.rows(1).cells(0).text).to.equal('Holdings - Notes - Action note');
      expect(mappingProfileDetails.transformations.list.rows(1).cells(1).text).to.equal('$901 2');
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
        <MappingProfileDetailsContainer mappingProfile={mappingProfileWithoutTransformations} />,
        translationsProperties,
      );
    });

    it('should display no value in description', () => {
      expect(mappingProfileDetails.summary.description.value.text).to.equal('-');
    });

    it('should not display delete confirmation modal', () => {
      expect(mappingProfileDetails.deletingConfirmationModal.isPresent).to.be.false;
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

      describe('clicking on delete profiles button', () => {
        const { deletingConfirmationModal } = mappingProfileDetails;

        beforeEach(async () => {
          await mappingProfileDetails.actionMenu.deleteProfileButton.click();
          await wait();
        });

        it('should display delete confirmation modal', () => {
          expect(deletingConfirmationModal.isPresent).to.be.true;
        });

        it('should display delete confirmation modal with correct messages', () => {
          const message = translations['mappingProfiles.delete.confirmationModal.message'].replace('{name}', mappingProfileWithoutTransformations.name);

          expect(deletingConfirmationModal.$('[data-test-headline]').innerText).to.equal(translations['mappingProfiles.delete.confirmationModal.title']);
          expect(deletingConfirmationModal.$('[data-test-confirmation-modal-message]').innerHTML).to.equal(message);
          expect(deletingConfirmationModal.cancelButton.text).to.equal(translations.cancel);
          expect(deletingConfirmationModal.confirmButton.text).to.equal(translations.delete);
        });

        describe('clicking on cancel button', () => {
          beforeEach(async () => {
            await deletingConfirmationModal.cancelButton.click();
            await wait();
          });

          it('should hide delete confirmation modal', () => {
            expect(deletingConfirmationModal.isPresent).to.be.false;
          });
        });
      });
    });
  });

  describe('rendering mapping profile details in loading state', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MappingProfileDetailsContainer
          isLoading
          isProfileUsed
          mappingProfile={mappingProfileWithoutTransformations}
        />,
        translationsProperties,
      );
    });

    it('should display preloader', () => {
      expect(mappingProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });
});
