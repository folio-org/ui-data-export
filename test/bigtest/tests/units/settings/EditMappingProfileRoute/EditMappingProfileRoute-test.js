import React from 'react';
import { useIntl } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  describe,
  it,
  beforeEach,
  before,
} from '@bigtest/mocha';
import { cleanup } from '@bigtest/react';
import { expect } from 'chai';
import { noop } from 'lodash';
import sinon from 'sinon';

import { Paneset } from '@folio/stripes/components';
import {
  buildResources,
  buildMutator,
  mountWithContext,
  wait,
} from '@folio/stripes-data-transfer-components/interactors';

import {
  mappingProfileWithTransformations as mappingProfile,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../network/scenarios/fetch-mapping-profiles-success';
import { getTotalSelectedMessage } from '../../../../helpers';
import {
  OverlayContainer,
  translationsProperties,
} from '../../../../../helpers';
import { EditMappingProfileRouteComponent } from '../../../../../../src/settings/MappingProfiles/EditMappingProfileRoute';
import { EditMappingProfileRouteInteractor } from './interactors/EditMappingProfileRouteInteractor';
import translations from '../../../../../../translations/ui-data-export/en';
import { CalloutContext } from '../../../../../../src/contexts/CalloutContext';

function EditMappingProfileRouteContainer({
  allTransformations = [],
  profile = mappingProfile,
  mutator = { PUT: noop },
  sendCallout = noop,
  onCancel = noop,
  onSubmitNavigate = noop,
} = {}) {
  const intl = useIntl();

  return (
    <Router>
      <OverlayContainer />
      <Paneset>
        <CalloutContext.Provider value={{ sendCallout }}>
          <EditMappingProfileRouteComponent
            contentLabel="Content label"
            allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
            resources={buildResources({
              resourceName: 'mappingProfile',
              records: [profile],
            })}
            mutator={buildMutator({ mappingProfile: mutator })}
            onCancel={onCancel}
            onSubmitNavigate={onSubmitNavigate}
          />
        </CalloutContext.Provider>
      </Paneset>
    </Router>
  );
}

describe('EditMappingProfileRoute', () => {
  const editMappingProfileRoute = new EditMappingProfileRouteInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering edit mapping profile page without profile data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <EditMappingProfileRouteContainer profile={null} />,
        translationsProperties
      );
    });

    it('should display preloader', () => {
      expect(editMappingProfileRoute.preloader.isPresent).to.be.true;
    });
  });

  describe('rendering edit mapping profile page with profile data: success scenario', () => {
    let handleSubmitSpy;
    let handleCancelSpy;
    let handleSaveSpy;
    let sendCalloutStub;

    beforeEach(async () => {
      handleSubmitSpy = sinon.stub().callsFake(Promise.resolve.bind(Promise));
      handleCancelSpy = sinon.spy();
      handleSaveSpy = sinon.spy();
      sendCalloutStub = sinon.spy();

      await mountWithContext(
        <EditMappingProfileRouteContainer
          allTransformations={allMappingProfilesTransformations}
          mutator={{ PUT: handleSubmitSpy }}
          sendCallout={sendCalloutStub}
          onCancel={handleCancelSpy}
          onSubmitNavigate={handleSaveSpy}
        />,
        translationsProperties
      );
    });

    it('should display the form', () => {
      expect(editMappingProfileRoute.form.isPresent).to.be.true;
    });

    it('should display shared full screen form elements', () => {
      expect(editMappingProfileRoute.form.fullScreen.isPresent).to.be.true;
    });

    it('should display add transformations button with proper wording', () => {
      expect(editMappingProfileRoute.form.addTransformationsButton.text).to.equal(translations['mappingProfiles.transformations.editTransformations']);
    });

    it('should display correct pane title', () => {
      expect(editMappingProfileRoute.form.fullScreen.header.text).to.equal(mappingProfile.name);
    });

    it('should have correct name field value', () => {
      expect(editMappingProfileRoute.form.summary.name.val).to.equal(mappingProfile.name);
    });

    it('should have correct folio record types field value', () => {
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(0).isChecked).to.be.false;
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(1).isChecked).to.be.false;
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(2).isChecked).to.be.true;
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(3).isChecked).to.be.false;
    });

    it('should have correct description field value', () => {
      expect(editMappingProfileRoute.form.summary.description.val).to.equal(mappingProfile.description);
    });

    it('should disable save button if there are no changes', () => {
      expect(editMappingProfileRoute.form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    it('should display correct transformations table with filled values', () => {
      const { transformations } = editMappingProfileRoute.form;

      expect(transformations.headers(0).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(editMappingProfileRoute.form.transformations.headers(1).text).to.equal(translations['mappingProfiles.transformations.transformation']);
      expect(transformations.rows(0).cells(0).text).to.equal('Holdings - Call number - Call number');
      expect(transformations.rows(0).cells(1).text).to.equal('11100$a');
      expect(transformations.rows(1).cells(0).text).to.equal('Holdings - Notes - Action note');
      expect(transformations.rows(1).cells(1).text).to.equal('123 1$12');
      expect(transformations.rowCount).to.equal(mappingProfile.transformations.length);
    });

    describe('changing fields values', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.summary.name.fillAndBlur('Changed name');
        await editMappingProfileRoute.form.summary.description.fillAndBlur('Changed description');
      });

      describe('submitting the form - success case', () => {
        beforeEach(async () => {
          await editMappingProfileRoute.form.fullScreen.submitButton.click();
        });

        it('should call submit callback with proper values', () => {
          expect(handleSubmitSpy.calledWith(sinon.match({
            id: mappingProfile.id,
            outputFormat: mappingProfile.outputFormat,
            transformations: sinon.match.array.deepEquals(mappingProfile.transformations),
            name: 'Changed name',
            description: 'Changed description',
            recordTypes: ['HOLDINGS'],
          }))).to.be.true;
        });

        it('should initiate displaying of success callout', () => {
          expect(sendCalloutStub.called).to.be.true;
          expect(sendCalloutStub.firstCall.args[0].type).to.be.undefined;
          expect(sendCalloutStub.firstCall.args[0].message.props.id).to.equal('ui-data-export.mappingProfiles.edit.successCallout');
        });

        it('should call save callback', () => {
          expect(handleSaveSpy.calledOnce).to.be.true;
        });
      });

      describe('submitting the form - error case', () => {
        beforeEach(async () => {
          handleSubmitSpy.callsFake(Promise.reject.bind(Promise));
          await editMappingProfileRoute.form.fullScreen.submitButton.click();
        });

        it('should call submit callback', () => {
          expect(handleSubmitSpy.called).to.be.true;
        });

        it('should initiate displaying of error callout', () => {
          expect(sendCalloutStub.calledWith(sinon.match({ type: 'error' })));
        });

        it('should call save callback', () => {
          expect(handleSaveSpy.calledOnce).to.be.true;
        });
      });
    });

    describe('clicking on cancel button', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.fullScreen.cancelButton.click();
      });

      it('should call cancel callback', () => {
        expect(handleCancelSpy.calledOnce).to.be.true;
      });
    });

    describe('opening transformations modal', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.addTransformationsButton.click();
        await wait();
      });

      it('should display proper amount of found transformations', () => {
        expect(editMappingProfileRoute.form.transformationsModal.resultsPane.header.sub).to.match(/2 fields/);
      });

      it('should display proper total selected count', () => {
        expect(editMappingProfileRoute.form.transformationsModal.totalSelected.text).to.equal(getTotalSelectedMessage(translations, 2));
      });

      it('should display correct transformation fields values', () => {
        const { transformationsModal } = editMappingProfileRoute.form;

        expect(transformationsModal.transformations.list.rows(0).cells(0).$('[data-test-select-field]:checked')).to.not.be.undefined;
        expect(transformationsModal.transformations.list.rows(1).cells(0).$('[data-test-select-field]:checked')).to.not.be.undefined;
        expect(transformationsModal.transformations.list.rows(0).cells(1).text).to.equal('Holdings - Call number - Call number');
        expect(transformationsModal.transformations.valuesFields(0).marcField.val).to.equal('111');
        expect(transformationsModal.transformations.valuesFields(0).indicator1.val).to.equal('0');
        expect(transformationsModal.transformations.valuesFields(0).indicator2.val).to.equal('0');
        expect(transformationsModal.transformations.valuesFields(0).subfield.val).to.equal('$a');
        expect(transformationsModal.transformations.list.rows(1).cells(1).text).to.equal('Holdings - Notes - Action note');
        expect(transformationsModal.transformations.valuesFields(1).marcField.val).to.equal('123');
        expect(transformationsModal.transformations.valuesFields(1).indicator1.val).to.equal('');
        expect(transformationsModal.transformations.valuesFields(1).indicator2.val).to.equal('1');
        expect(transformationsModal.transformations.valuesFields(1).subfield.val).to.equal('$12');
      });

      describe('changing transformations modal values', () => {
        beforeEach(async () => {
          await editMappingProfileRoute.form.transformationsModal.transformations.checkboxes(1).clickInput();
        });

        it('should display proper total selected count', () => {
          expect(editMappingProfileRoute.form.transformationsModal.totalSelected.text).to.equal(getTotalSelectedMessage(translations, 1));
        });

        describe('saving filled and checked transformation', () => {
          beforeEach(async () => {
            await editMappingProfileRoute.form.transformationsModal.saveButton.click();
          });

          it('should display correct transformations table with filled values', () => {
            const { transformations } = editMappingProfileRoute.form;

            expect(transformations.headers(0).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
            expect(editMappingProfileRoute.form.transformations.headers(1).text).to.equal(translations['mappingProfiles.transformations.transformation']);
            expect(transformations.rows(0).cells(0).text).to.equal('Holdings - Call number - Call number');
            expect(transformations.rows(0).cells(1).text).to.equal('11100$a');
            expect(transformations.rowCount).to.equal(1);
          });
        });
      });
    });
  });

  describe('rendering edit mapping profile page with profile without transformations', () => {
    beforeEach(async () => {
      await mountWithContext(
        <EditMappingProfileRouteContainer
          allTransformations={allMappingProfilesTransformations}
          profile={{
            ...mappingProfile,
            transformations: null,
          }}
        />,
        translationsProperties
      );
    });

    it('should display edit form', () => {
      expect(editMappingProfileRoute.form.isPresent).to.be.true;
    });

    it('should disable submit button', () => {
      expect(editMappingProfileRoute.form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    describe('selecting transformations', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.addTransformationsButton.click();
        await wait();
        await editMappingProfileRoute.form.transformationsModal.transformations.checkboxes(1).clickInput();
        await editMappingProfileRoute.form.transformationsModal.transformations.valuesFields(1).marcField.fillAndBlur('123');
        await editMappingProfileRoute.form.transformationsModal.transformations.valuesFields(1).subfield.fillAndBlur('$r');
        await editMappingProfileRoute.form.transformationsModal.saveButton.click();
        await wait();
      });

      it('should enable submit button', () => {
        expect(editMappingProfileRoute.form.fullScreen.submitButton.$root.disabled).to.be.false;
      });
    });
  });
});
