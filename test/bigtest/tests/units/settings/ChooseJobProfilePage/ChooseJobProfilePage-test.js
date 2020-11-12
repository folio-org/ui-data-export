import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@bigtest/react';
import {
  describe,
  it,
  beforeEach,
  before,
} from '@bigtest/mocha';

import {
  mountWithContext,
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../../helpers';
import { ChooseJobProfileComponent as ChooseJobProfile } from '../../../../../../src/components/ChooseJobProfile';
import { ChooseJobProfileInteractor } from './interactor';

const chooseJobProfile = new ChooseJobProfileInteractor();

const resources = buildResources({
  resourceName: 'jobProfiles',
  records: [{
    id: 'jobProfile1',
    name: 'A Lorem ipsum 1',
    description: 'Description 1',
    userInfo: {
      firstName: 'Donald',
      lastName: 'S',
    },
    metadata: { updatedDate: '2018-12-04T09:05:30.000+0000' },
  },
  {
    id: 'jobProfile2',
    name: 'A Lorem ipsum 2',
    description: 'Description 2',
    userInfo: {
      firstName: 'Mark',
      lastName: 'K',
    },
    metadata: { updatedDate: '2018-11-04T11:22:31.000+0000' },
  }],
  hasLoaded: true,
});

describe('ChooseJobProfile', () => {
  describe('rendering ChooseJobProfile', () => {
    const exportProfileSpy = sinon.stub();
    const pushHistorySpy = sinon.spy();
    const mutator = buildMutator({ export: { POST: exportProfileSpy } });
    const location = { state: { fileDefinitionId: 'fileDefinitionId' } };

    before(async () => {
      await cleanup();
    });

    beforeEach(async () => {
      exportProfileSpy.reset();
      pushHistorySpy.resetHistory();

      await mountWithContext(
        <Router>
          <ChooseJobProfile
            resources={resources}
            mutator={mutator}
            history={{ push: pushHistorySpy }}
            location={location}
          />
        </Router>,
        translationsProperties
      );
    });

    it('should be visible', () => {
      expect(chooseJobProfile.jobProfiles.isPresent).to.be.true;
    });

    it('should display correct title', () => {
      expect(chooseJobProfile.jobProfiles.header.title.labelText).to.equal(translations['jobProfiles.selectProfile.title']);
    });

    it('should display correct subtitle', () => {
      expect(chooseJobProfile.jobProfiles.header.subTitleText).to.equal('2 job profiles');
    });

    it('should place headers in correct order', () => {
      const { list } = chooseJobProfile.jobProfiles.searchResults;

      expect(list.headers(0).text).to.equal(translations.name);
      expect(list.headers(1).text).to.equal(translations.description);
      expect(list.headers(2).text).to.equal(commonTranslations.updated);
      expect(list.headers(3).text).to.equal(commonTranslations.updatedBy);
    });

    it('should not display the confirmation modal', () => {
      expect(chooseJobProfile.confirmationModal.isPresent).to.be.false;
    });

    it('should display correct data for the first row', () => {
      const { getCellContent } = chooseJobProfile.jobProfiles.searchResults;

      expect(getCellContent(0, 0)).to.equal('A Lorem ipsum 1');
      expect(getCellContent(0, 1)).to.equal('Description 1');
      expect(getCellContent(0, 2)).to.equal('12/4/2018');
      expect(getCellContent(0, 3)).to.equal('Donald S');
    });

    describe('clicking on row', () => {
      beforeEach(async () => {
        await chooseJobProfile.jobProfiles.searchResults.list.rows(0).click();
      });

      it('should display the confirmation modal', () => {
        expect(chooseJobProfile.confirmationModal.isPresent).to.be.true;
      });

      it('should display modal with proper header', () => {
        expect(chooseJobProfile.confirmationModal.$('[data-test-headline]').innerText).to.equal(translations['jobProfiles.selectProfile.modal.title']);
      });

      it('should display modal profile name in the body', () => {
        expect(chooseJobProfile.confirmationModal.$('[data-test-confirmation-modal-message]').innerHTML).contains('A Lorem ipsum 1');
      });

      it('should display modal with proper wording for buttons', () => {
        expect(chooseJobProfile.confirmationModal.cancelButton.text).to.equal(translations.cancel);
        expect(chooseJobProfile.confirmationModal.confirmButton.text).to.equal(translations.run);
      });

      describe('clicking on cancel button', () => {
        beforeEach(async () => {
          await chooseJobProfile.confirmationModal.cancelButton.click();
        });

        it('should close the modal', () => {
          expect(chooseJobProfile.confirmationModal.isPresent).to.be.false;
        });
      });

      describe('clicking on confirm button - success case', () => {
        beforeEach(async () => {
          await chooseJobProfile.confirmationModal.confirmButton.click();
        });

        it('should initiate the export process by calling the API with correct params', () => {
          expect(exportProfileSpy.calledWith({
            fileDefinitionId: location.state.fileDefinitionId,
            jobProfileId: resources.jobProfiles.records[0].id,
          })).to.be.true;
        });

        it('should navigate to the landing page', () => {
          expect(pushHistorySpy.calledWith('/data-export')).to.be.true;
        });
      });

      describe('clicking on confirm button - error case', () => {
        beforeEach(async () => {
          exportProfileSpy.returns(Promise.reject());
          await chooseJobProfile.confirmationModal.confirmButton.click();
        });

        it('should close the confirmation modal', () => {
          expect(chooseJobProfile.confirmationModal.isPresent).to.be.false;
        });

        it('should not navigate to the landing page', () => {
          expect(pushHistorySpy.called).to.be.false;
        });
      });
    });
  });
});
