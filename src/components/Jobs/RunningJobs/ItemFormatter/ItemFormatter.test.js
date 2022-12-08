import React from 'react';

import '../../../../../test/jest/__mock__';
import '../../../../../test/jest/__new_mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import ItemFormatter from '.';

import { translationsProperties } from '../../../../../test/helpers';

const jobMock = {
    id: 1,
    hrId : 123,
    exportedFiles : [ {
      fileId : 'e7153aea-1788-4eb6-a6c5-9cdf6ed474f8',
      fileName : 'SearchInstanceUUIDs2022-12-06T02_28_37-05_00-7673.mrc'
    } ],
    jobProfileName : 'Holdings HRIDs',
    progress : {
      exported : 1,
      failed : 0,
      total : 2,
    },
    startedDate : '2022-12-06T07:29:03.806+00:00',
    runBy : {
      firstName : 'test',
      lastName : 'test'
    },
};

const setupItemFormatter = () => {
  renderWithIntl(
    ItemFormatter(jobMock),
    translationsProperties
  )
};

describe('ItemFormatter', () => {
  it('should display Job details', () => {
    setupItemFormatter();

    expect(screen.getByText('Holdings HRIDs')).toBeVisible();
    expect(screen.getByText('SearchInstanceUUIDs2022-12-06T02_28_37-05_00-7673.mrc')).toBeVisible();
    expect(screen.getByText('50%')).toBeVisible();
  });

});
