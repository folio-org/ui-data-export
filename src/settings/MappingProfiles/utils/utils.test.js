import { mappingProfilesData } from '@folio/stripes-data-transfer-components/lib/Settings/MappingProfiles/tests/mappingProfilesData';
import { formatJobProfileFormInitialValues } from './formatJobProfileFormInitialValues';
import { formatMappingProfileFormInitialValues } from './formatMappingProfileFormInitialValues';
import { getFormattedMappingProfiles } from './mappingProfiles';

export const jobProfile = {
  id: 'someId',
  name: 'A Lorem impsum 1',
  destination: 'fileSystem',
  description: 'Job profile description',
  userInfo: {
    firstName: 'Donald',
    lastName: 'S',
    userName: 'diku_admin',
  },
  mappingProfileId: '25d81cbe-9686-11ea-bb37-0242ac130005',
  metadata: {
    createdDate: '2018-12-04T11:22:07Z',
  },
};

export const mappingProfile = {
  id: '25d81cbe-9686-11ea-bb37-0242ac130005',
  name: 'AP Holdings and Items',
  description: null,
  recordTypes: ['HOLDINGS'],
  transformations: [],
  outputFormat: 'MARC',
  userInfo: {
    firstName: 'Donald',
  },
  metadata: {
    createdByUserId: '25d81cbe-9686-11ea-bb37-0242ac130005',
  },
};

describe('formatJobProfileFormInitialValues.js', () => {
  it('should default fields (metadata, userInfo)', () => {
    expect(jobProfile.metadata).not.toBeUndefined();
    expect(jobProfile.userInfo).not.toBeUndefined();

    const result = formatJobProfileFormInitialValues(jobProfile);

    expect(result.metadata).toBeUndefined();
    expect(result.userInfo).toBeUndefined();
  });

  it('should remove additional fields', () => {
    expect(jobProfile.destination).not.toBeUndefined();

    const result = formatJobProfileFormInitialValues(jobProfile, ['destination']);

    expect(result.destination).toBeUndefined();
  });
});

describe('formatMappingProfileFormInitialValues.js', () => {
  it('should default fields (metadata, userInfo)', () => {
    expect(mappingProfile.metadata).not.toBeUndefined();
    expect(mappingProfile.userInfo).not.toBeUndefined();
    expect(mappingProfile.transformations).not.toBeUndefined();

    const result = formatMappingProfileFormInitialValues(mappingProfile);

    expect(result.metadata).toBeUndefined();
    expect(result.userInfo).toBeUndefined();
    expect(result.transformations).toStrictEqual([]);
  });

  it('should remove additional fields', () => {
    expect(mappingProfile.recordTypes).not.toBeUndefined();

    const result = formatMappingProfileFormInitialValues(mappingProfile, ['recordTypes']);

    expect(result.recordTypes).toBeUndefined();
  });
});

describe('mappingProfiles.js', () => {
  it('result should consist of expected fields', () => {
    const result = getFormattedMappingProfiles(mappingProfilesData);
    const wrongKey = Object.keys(result[0]).find(k => k !== 'label' && k !== 'value');

    expect(wrongKey).toBeUndefined();
    expect(result.length).toEqual(mappingProfilesData.length);
    expect(result[0]).toStrictEqual({
      label: mappingProfilesData[0].name,
      value: mappingProfilesData[0].id,
    });
  });
});
