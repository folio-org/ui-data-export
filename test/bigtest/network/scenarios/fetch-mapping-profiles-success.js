import { DEFAULT_MAPPING_PROFILE_ID } from '../../../../src/utils';

export const allMappingProfilesTransformations = [
  {
    fieldId: 'holdings.callnumber',
    displayNameKey: 'holdings.callNumber',
    path: '$.holdings[*].callNumber',
    recordType: 'HOLDINGS',
  },
  {
    fieldId: 'holdings.holdingnotetypeid.action.note',
    displayNameKey: 'holdings.holdingNoteTypeId',
    referenceDataValue: 'Action note',
    path: "$.holdings[*].notes[?(@.holdingsNoteTypeId=='d6510242-5ec3-42ed-b593-3585d2e48fd6' && (!(@.staffOnly) || @.staffOnly == false))].note",
    recordType: 'HOLDINGS',
  },
];

export const generateTransformationsWithDisplayName = (intl, transformations) => transformations.map(transformation => ({
  ...transformation,
  displayName: intl.formatMessage(
    { id: `ui-data-export.${transformation.displayNameKey}` },
    { value: transformation.referenceDataValue }
  ),
}));

export const mappingProfileWithTransformations = {
  id: DEFAULT_MAPPING_PROFILE_ID,
  name: 'AP Holdings 1',
  description: 'AP Holdings 1 description',
  recordTypes: ['HOLDINGS'],
  transformations: [
    {
      fieldId: 'holdings.callnumber',
      path: '$.holdings[*].callNumber',
      enabled: true,
      transformation: '11100$a',
      recordType: 'HOLDINGS',
    },
    {
      fieldId: 'holdings.holdingnotetypeid.action.note',
      path: "$.holdings[*].notes[?(@.holdingsNoteTypeId=='d6510242-5ec3-42ed-b593-3585d2e48fd6' && (!(@.staffOnly) || @.staffOnly == false))].note",
      enabled: true,
      transformation: '123 1$12',
      recordType: 'HOLDINGS',
    },
  ],
  userInfo: {
    firstName: 'Donald',
    lastName: 'S',
    userName: 'system_process',
  },
  outputFormat: 'MARC',
  metadata: {
    createdByUserId: '25d81cbe-9686-11ea-bb37-0242ac130002',
    updatedByUserId: '25d81cbe-9686-11ea-bb37-0242ac130002',
    createdDate: '2018-12-04T01:29:36.531+0000',
    updatedDate: '2018-12-04T01:29:36.531+0000',
  },
};

export const mappingProfile = {
  id: '25d81cbe-9686-11ea-bb37-0242ac130005',
  name: 'AP Holdings and Items',
  description: null,
  recordTypes: ['HOLDINGS'],
  transformations: [],
  outputFormat: 'MARC',
  metadata: {
    createdByUserId: '25d81cbe-9686-11ea-bb37-0242ac130005',
    updatedByUserId: '25d81cbe-9686-11ea-bb37-0242ac130005',
    createdDate: '2018-12-04T01:29:36.531+0000',
    updatedDate: '2018-12-04T01:29:36.531+0000',
  },
};

export default server => {
  server.create('mapping-profile', mappingProfileWithTransformations);
  server.create('mapping-profile', mappingProfile);

  server.get('/data-export/transformation-fields', { transformationFields: allMappingProfilesTransformations });
  server.get('/data-export/mapping-profiles', schema => schema.mappingProfiles.all());
};
