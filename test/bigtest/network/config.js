// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import { errorLogs } from '../fixtures/errorLogs';

export const mockLink = 'https://test-aws-export-vk.s3.amazonaws.com/CatShip.mrc?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200220T185104Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKUAIZOH6UABI4QDF678%2F20200220%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2d87fd96cd1b05ee74228ee9124bc0ad34196a08b03c62453e9588aa3e485a77';

export default function config() {
  this.post('/data-export/export', {}, 200);
  this.post('/data-export/file-definitions', {}, 200);
  this.post('/data-export/file-definitions/:id/upload', { id: 'id' }, 200);

  this.get('/data-export/job-executions', {
    jobExecutions: [],
    totalRecords: 3,
  }, 200);

  this.get('/data-export/job-executions/:jobLogId/download/:fileId', {
    fileId: '448ae575-daec-49c1-8041-d64c8ed8e5b1',
    link: mockLink,
  }, 200);

  this.get('/data-export/mapping-profiles', {
    mappingProfiles: [],
    totalRecords: 0,
  });

  this.post('/data-export/job-profiles', {}, 201);

  this.post('/data-export/mapping-profiles', {}, 201);

  this.get('/data-export/job-profiles', {
    jobProfiles: [],
    totalRecords: 0,
  });

  this.get('/data-export/job-profiles/:id', (schema, request) => schema.jobProfiles.find(request.params.id).attrs);
  this.delete('/data-export/job-profiles/:id', {}, 204);

  this.get('/data-export/mapping-profiles/:id', (schema, request) => schema.mappingProfiles.find(request.params.id).attrs);
  this.delete('/data-export/mapping-profiles/:id', {}, 204);

  this.get('/data-export/logs', { errorLogs });
}
