// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  this.post('/data-export/export', {}, 200);
  this.post('/data-export/fileDefinitions', {}, 200);
  this.post('/data-export/fileDefinitions/:id/upload', {}, 200);
}
