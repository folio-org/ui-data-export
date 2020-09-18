import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  describe,
  it,
  beforeEach,
  before,
} from '@bigtest/mocha';
import { cleanup } from '@bigtest/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { RECORD_TYPES } from '../../../../../../src/utils';
import { SearchForm } from '../../../../../../src/settings/MappingProfiles/MappingProfilesTransformationsModal/SearchForm';
import { translationsProperties } from '../../../../helpers';
import translations from '../../../../../../translations/ui-data-export/en';
import { TransformationsSearchFormInteractor } from './interactors/TransformationsSearchFormInteractor';

const initialValues = { filters: { recordTypes: RECORD_TYPES.map(recordType => recordType.value) } };

describe('TransformationsSearchForm', () => {
  const searchForm = new TransformationsSearchFormInteractor();
  const handleFiltersChangeSpy = sinon.spy();
  const handleResetSpy = sinon.spy();
  const handleSubmitSpy = sinon.spy();

  before(async () => {
    await cleanup();
  });

  describe('rendering transformations search form', () => {
    beforeEach(async () => {
      handleFiltersChangeSpy.resetHistory();
      handleResetSpy.resetHistory();
      handleSubmitSpy.resetHistory();

      await mountWithContext(
        <Router>
          <SearchForm
            initialValues={initialValues}
            onFiltersChange={handleFiltersChangeSpy}
            onReset={handleResetSpy}
            onSubmit={handleSubmitSpy}
          />
        </Router>,
        translationsProperties,
      );
    });

    it('should display search form', () => {
      expect(searchForm.isPresent).to.be.true;
    });

    it('should display filter accordions set', () => {
      expect(searchForm.filterAccordions.isPresent).to.be.true;
    });

    it('should display correct filter accordions headers', () => {
      expect(searchForm.filterAccordions.set(0).label).to.equal(translations.recordType);
    });

    it('should display search field', () => {
      expect(searchForm.searchField.isPresent).to.be.true;
    });

    it('should display correct folio record types', () => {
      expect(searchForm.recordTypeFilters(0).label).to.equal(commonTranslations['recordTypes.instance']);
      expect(searchForm.recordTypeFilters(1).label).to.equal(commonTranslations['recordTypes.holdings']);
      expect(searchForm.recordTypeFilters(2).label).to.equal(commonTranslations['recordTypes.item']);
    });

    it('should display reset button', () => {
      expect(searchForm.resetButton.isPresent).to.be.true;
      expect(searchForm.resetButton.text).to.equal(translations.resetAll);
    });

    describe('turning off certain filters and searching by non empty value', () => {
      beforeEach(async () => {
        await searchForm.recordTypeFilters(1).clickAndBlur();
        await searchForm.recordTypeFilters(2).clickAndBlur();
        await searchForm.searchField.fillAndBlur('call');
        await searchForm.submit();
      });

      it('should uncheck filters', () => {
        expect(searchForm.recordTypeFilters(1).isChecked).to.be.false;
        expect(searchForm.recordTypeFilters(2).isChecked).to.be.false;
      });

      it('should update the form state for the filters correctly', () => {
        const expected = {
          searchValue: 'call',
          filters: { recordTypes: [RECORD_TYPES[0].value] },
        };

        expect(handleSubmitSpy.calledWith(expected)).to.be.true;
      });

      it('should call the provided on change filters callback with correct values', () => {
        expect(handleFiltersChangeSpy.firstCall.args).to.deep.equal(['recordTypes', [RECORD_TYPES[0].value, RECORD_TYPES[2].value]]);
        expect(handleFiltersChangeSpy.secondCall.args).to.deep.equal(['recordTypes', [RECORD_TYPES[0].value]]);
      });

      describe('clicking on reset search form button', () => {
        beforeEach(async () => {
          await searchForm.resetButton.click();
          await searchForm.submit();
        });

        it('should check filters', () => {
          expect(searchForm.recordTypeFilters(1).isChecked).to.be.true;
          expect(searchForm.recordTypeFilters(2).isChecked).to.be.true;
        });

        it('should call the provided callback', () => {
          expect(handleResetSpy.called).to.be.true;
        });

        it('should clear search field', () => {
          expect(searchForm.searchField.val).to.equal('');
        });
      });

      describe('turning on filters again and searching by empty value', () => {
        beforeEach(async () => {
          await searchForm.recordTypeFilters(1).clickAndBlur();
          await searchForm.recordTypeFilters(2).clickAndBlur();
          await searchForm.searchField.fillAndBlur('');
          await searchForm.submit();
        });

        it('should check filters', () => {
          expect(searchForm.recordTypeFilters(1).isChecked).to.be.true;
          expect(searchForm.recordTypeFilters(2).isChecked).to.be.true;
        });

        it('should update the form to initial values', () => {
          expect(handleSubmitSpy.calledWith(initialValues)).to.be.true;
        });
      });
    });
  });
});
