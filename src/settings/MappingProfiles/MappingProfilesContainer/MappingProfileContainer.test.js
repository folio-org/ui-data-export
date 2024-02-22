import React from 'react';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { MappingProfilesContainer } from './index';

jest.mock('../CreateMappingProfileFormRoute', () => ({
  CreateMappingProfileFormRoute: () => <div>CreateMappingProfileRoute</div>,
}));

jest.mock('../EditMappingProfileRoute', () => ({
  EditMappingProfileRoute: () => <div>EditMappingProfileRoute</div>,
}));

jest.mock('../DuplicateMappingProfileRoute', () => ({
  DuplicateMappingProfileRoute: () => <div>DuplicateMappingProfileRoute</div>,
}));


const mockHistory = {
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  index: 0,
  length: 0,
  listen: jest.fn(),
  location: {
    hash: '',
    key: 'mockKey',
    pathname: '/mockPath',
    search: '?mock=query',
    state: {
      mockState: 'value',
    },
  },
  push: jest.fn(),
  replace: jest.fn(),
};

export const mockLocation = {
  hash: '#mockHash',
  key: 'mockKey',
  pathname: '/mockPath',
  search: '?mock=query',
  state: {
    mockState: 'value',
  },
};

const setupMappingProfilesContainer = initialEntries => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <MemoryRouter initialEntries={initialEntries}>
        <MappingProfilesContainer
          resources={{
            'initializedFilterConfig': false,
            'query': {
              'query': '',
              'sort': 'name'
            },
            'resultCount': 100,
            'mappingProfiles': {
              'hasLoaded': false,
              'isPending': false,
              'failed': false,
              'records': [],
              'successfulMutations': [],
              'failedMutations': [],
              'pendingMutations': []
            },
            'transformations': {
              'hasLoaded': true,
              'isPending': false,
              'failed': false,
              'records': [],
              'successfulMutations': [],
              'failedMutations': [],
              'pendingMutations': []
            }
          }}
          mutator={{ mappingProfiles: { POST: noop } }}
          match={{ params: { }, path: '/data-export/mapping-profiles', url: '/' }}
          history={mockHistory}
          location={mockLocation}
        />
      </MemoryRouter>,
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('MappingProfilesContainer', () => {
  it('should render create mapping profile', async () => {
    setupMappingProfilesContainer(['/data-export/mapping-profiles/create']);

    const createJobProfile = await screen.findByText(/CreateMappingProfileRoute/i);

    expect(createJobProfile).toBeVisible();
  });

  it('should render edit mapping profile', async () => {
    setupMappingProfilesContainer(['/data-export/mapping-profiles/edit/1']);

    const editJobProfile = await screen.findByText(/EditMappingProfileRoute/i);

    expect(editJobProfile).toBeVisible();
  });

  it('should render duplicate mapping profile', async () => {
    setupMappingProfilesContainer(['/data-export/mapping-profiles/duplicate/1']);

    const duplicateJobProfile = await screen.findByText(/DuplicateMappingProfileRoute/i);

    expect(duplicateJobProfile).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    setupMappingProfilesContainer(['/data-export/mapping-profiles/duplicate/1']);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
