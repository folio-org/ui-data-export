import { DEFAULT_MAPPING_PROFILE_ID } from '../../../../src/utils';

export const mappingProfileWithTransformations = {
  id: DEFAULT_MAPPING_PROFILE_ID,
  name: 'AP Holdings 1',
  description: 'AP Holdings 1 description',
  recordTypes: ['HOLDINGS'],
  transformations: [{
    fieldId: 'callNumber',
    path: '$.holdings[*].callNumber',
    enabled: true,
    transformation: 'test',
    recordType: 'HOLDINGS',
  }],
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
  name: 'AP Holdings & Items',
  description: null,
  recordTypes: ['HOLDINGS', 'ITEM'],
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

  server.get('/data-export/mappingProfiles', schema => schema.mappingProfiles.all());
};
