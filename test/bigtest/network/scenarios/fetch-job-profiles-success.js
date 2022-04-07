const JOB_PROFILE_ID = '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a';

export const jobProfile = {
  id: JOB_PROFILE_ID,
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
    createdByUserId: 'dee12548-9cee-45fa-bbae-675c1cc0ce3b',
    createdByUsername: 'janedoeuser',
    updatedDate: '2018-12-04T13:28:54Z',
    updatedByUserId: 'dee12548-9cee-45fa-bbae-675c1cc0ce3b',
    updatedByUsername: '',
  },
};

export default server => {
  server.create('job-profile', jobProfile);

  server.createList('job-profile', 2);

  server.get('/data-export/job-profiles', schema => {
    return schema.jobProfiles.all();
  });
};
