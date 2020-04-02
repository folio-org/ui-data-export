# Change history for ui-data-export

## 1.1.0 (IN PROGRESS)

## [1.0.1](https://github.com/folio-org/ui-data-export/tree/v1.0.1) (2020-04-02)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v1.0.0...v1.0.1)
* Populate jobId field on job logs, update `stripes-smart-components` to `v3.0.0` to avoid errors. UIDEXP-35.
* Populate runBy field on jobs logs and running jobs. UIDEXP-37.
* Retrieve only latest logs on landing page. Fixes UIDEXP-56.
* Populate records field on jobs logs. UIDEXP-36.

## [1.0.0](https://github.com/folio-org/ui-data-export/tree/v1.0.0) (2020-03-13)
* UI app created. Refs UIDEXP-8.
* Handle security issue because of eslint version, remove excess eslint rules, upgrade babel and eslint-config-stripes versions. Refs UIDEXP-17.
* Add dependency on @folio/stripes-data-transfer-components. Add file uploader feature on landing page. Refs UIDEXP-11.
* Add running jobs components to display temp static data. Refs UIDEXP-6.
* Implement logic for initiating the export job process once the user has selected file. Refs UIDEXP-20.
* Add validation to QueryFileUploaderComponent to let user upload only file with csv extension. UIDEXP-21.
* Update `stripes` to `v3.0.0`, `stripes-core` to `4.0.0` and `react-intl` to `2.9.0`. UIDEXP-30.
* Add jobs log display with static data. UIDEXP-7.
* Implement logic for periodical fetching of running jobs and logs. Refs UIDEXP-22.
* Periodically update running jobs and logs lists. Refs UIDEXP-23.
* Provide the way to download an export file from job logs. UIDEXP-29.
