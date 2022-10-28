# Change history for ui-data-export

## IN PROGRESS

## [5.3.0](https://github.com/folio-org/ui-data-export/tree/v5.3.0) (2022-10-28)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.2.3...v5.3.0)

* Numeric values are sorted alphabetically on View all logs form. Refs UIDEXP-289
* react-virtualized-auto-sizer is incorrectly listed as a peer-dependency.Refs UIDEXP-290.

## [5.2.3](https://github.com/folio-org/ui-data-export/tree/v5.2.3) (2022-08-16)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.2.2...v5.2.3)
* Missing data in Updated and Updated by columns for job profiles. Refs UIDEXP-284

## [5.2.2](https://github.com/folio-org/ui-data-export/tree/v5.2.2) (2022-08-04)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.2.1...v5.2.2)
* Github Actions: Test failures with both node v14 and v16 in Github Actions CI. UIDEXP-282

## [5.2.1](https://github.com/folio-org/ui-data-export/tree/v5.2.1) (2022-07-22)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.2.0...v5.2.1)
* "Undefined" value display at "Run by" column when user has no "First name" value. UIDEXP-280
* The search box is reset after updating filter in the Select transformations UIDEXP-270
* Replace babel-eslint with @babel/eslint-parser. Refs UIDEXP-276

## [5.2.0](https://github.com/folio-org/ui-data-export/tree/v5.2.0) (2022-07-08)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.1.1...v5.2.0)

* Implement user notification when response after uploading file is 413. UIDEXP-271
* Adjust UI to changes about the default profiles (instances and holdings) check. UIDEXP-128
* Update Data Export > Are you sure you want to run this job? Confirmation modal to include Authorities in dropdown. UIDEXP-275
* Data export UI cleanup. UIDEXP-277
* User does not have enough permissions to create Data Export Job profile. UIDEXP-281

## [5.1.1](https://github.com/folio-org/ui-data-export/tree/v5.1.1) (2022-04-07)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.1.0...v5.1.1)
* Undefined permission 'data-export.mapping-profiles.collection.get', ... UIDEXP-269

## [5.1.0](https://github.com/folio-org/ui-data-export/tree/v5.1.0) (2022-03-04)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v5.0.0...v5.1.0)
* Select UUIDs type before starting export. UIDEXP-177
* Use correct `css-loader` syntax. UIDEXP-255
* Add aria-label in mapping profile transformations list. UIDEXP-214
* Job profile – edit existing profile. UIDEXP-112
* Job profile – duplicate existing profile. UIDEXP-113
* The list of errors is truncated. UIDEXP-259
* Add total number of records to be exported to the Running component. UIDEXP-161
* Refactor away from SafeHTMLMessage. UIDEXP-216
* When go to Settings > Data export, change focus automatically to data-export pane header. UIDEXP-264
* Refactor away from react-intl-safe-html. UIDEXP-235


## [5.0.0](https://github.com/folio-org/ui-data-export/tree/v5.0.0) (2021-10-08)
[Full Changelog](https://github.com/folio-org/ui-data-export/compare/v4.1.0...v5.0.0)
* Mapping profiles list not ordered alphabetically on the new job profile form. UIDEXP-241.
* Fix Error when cloning mapping profile from the prior relases. UIDEXP-242.
* Saving a custom mapping profile not always checks for matching transformations. UIDEXP-239.
* Update the UI permission names for current Data export permissions. UIDEXP-231.
* Compile Translation Files into AST Format. UIDEXP-233.
* increment stripes to v7. UIDEXP-246.
* Hide placeholder attribute once user populates the first row. UIDEXP-249.

## [4.1.0](https://github.com/folio-org/ui-data-export/tree/v4.0.0) (2021-06-11)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v4.0.0...v4.1.0)
* Handle broken BigTest test. UIDEXP-237.
* Update translations

## [4.0.0](https://github.com/folio-org/ui-data-export/tree/v4.0.0) (2021-03-12)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v3.0.2...v4.0.0)
* Setup jest/react-testing-library and cover `ChooseJobProfile` component and util methods with tests. UIDEXP-179.
* Adjust `ui-data-export` after the change in the `JobsListAccordion` in `stripes-data-transfer-components` with regard to data-test attribute. UIDATIMP-574.
* Add "Copy of" to the mapping profile name upon duplication. UIDEXP-181.
* Bump `babel-eslint` to `v10.0.3`, adjust tests after updates to `Preloader` interactor. UIDATIMP-580.
* Add Source Record Storage option to the mapping profile. UIDEPX-178.
* Handle `ESLint` inconsistencies with `stripes-data-transfer-components` module. UIDEXP-206.
* Fix inability to create mapping profile with SRS and Holdings/Item types. UIDEXP-209.
* Modify transformation form to ensure proper data entry for MARC Bib mappings. UIDEXP-180.
* Migrate to local callout solution. UIDEXP-143.
* Move pretender to dev dependencies. UIDEXP-186.
* Change failed job row click behavior, so it redirects to a page within same tab. UIDEXP-200.
* Add validation to the mapping profile transformations. UIDEXP-187.
* Display title only for instances on error logs page. UIDEXP-211.
* Replace translation keys with translations on Error logs page. UIDEXP-213.
* Fix incorrect field validation when clearing filled transformation. UIDEXP-217.
* Add a visual cue to invalid entry on transformation form. UIDEXP-220.
* Update `stripes` to `v6.0.0`. UIDEXP-221.
* Clear the validation error after user adjusts data entry in transformation field. UIDEXP-218.
* Add placeholder to the transformation form. UIDEXP-219.
* Use react-query for job profile details page. UIDEXP-224.
* Display a link to the inventory record on Error logs page. UIDEXP-203.
* Update `stripes-cli` to `v2.0.0`. UIDEXP-227.
* Change message for mapping exception for Error logs page. UIDEXP-229.
* Update translations

## [3.0.2](https://github.com/folio-org/ui-data-export/tree/v3.0.2) (2020-11-13)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v3.0.1...v3.0.2)
* Handle missing job progress field. UIDEXP-208.

## [3.0.1](https://github.com/folio-org/ui-data-export/tree/v3.0.1) (2020-11-12)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v3.0.0...v3.0.1)
* Fix `Save & Close` button on the Edit mapping profile page not closing the profile. UIDEXP-167.
* Fix inability to view error logs for an empty file. UIDEXP-182.
* Update translations

## [3.0.0](https://github.com/folio-org/ui-data-export/tree/v3.0.0) (2020-10-15)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v2.0.1...v3.0.0)
* Add translations for permission names. UIDEXP-76.
* Fix accessibility string building for MCL components. UIDEXP-117.
* Implement mapping profile details action menu. UIDEXP-75.
* Fix spacing display of Transformation fields on mapping profile view page. UIDEXP-129.
* Add job profiles deleting. UIDEXP-111.
* Refactor to miragejs from bigtest/mirage. UIDEXP-137.
* Implement add mapping profile transformations modal. UIDEXP-104.
* Add mapping profiles deleting. UIDEXP-133.
* Implement record type filter behavior in add mapping profile transformations modal. UIDEXP-69.
* Accommodate `FullScreenView` component usage according to [changes in stripes-data-transfer-components](https://github.com/folio-org/stripes-data-transfer-components/pull/88/files). UIDATIMP-535.
* Implement search feature in mapping profile transformations. UIDEXP-130.
* Update `stripes` to `v5.0.0` and `react-router-dom` to `5.2.0`. Move `stripes-data-transfer-components` to `dependencies`. Remove couple TODOs. UIDEXP-136.
* Implement transformations selection. UIDEXP-71.
* Create code style guide document. UIDEXP-148.
* Implement transformations saving. UIDEXP-73.
* Cover closing functionality of mapping profile form by tests. UIDEXP-99.
* Implement edit mapping profile feature. UIDEXP-132.
* Provide translations for the mapping profile transformation field names. UIDEXP-140.
* Update endpoints names according to changes on backend side. UIDEXP-146.
* Add validation between selected record types and transformations on form submit. UIDEXP-138.
* Provide translations for the mapping profile transformation field names. UIDEXP-151.
* Integrate mapping profiles transformations list with backend. UIDEXP-92.
* Accommodate UI to the change for the retrieving of job logs API endpoint. UIDEXP-145.
* Implement mapping profile transformations editing. UIDEXP-131.
* Provide translations for the mapping profile transformation field names. UIDEXP-159.
* Implement transition to error logs page. UIDEXP-18.
* Fix form state updating after transformations field change on mapping profile form. UIDEXP-153.
* Implement status filter behavior in add mapping profile transformations modal. UIDEXP-135.
* Implement mapping profile duplicating. UIDEXP-134.
* Implement view all logs list. UIDEXP-142.
* Rearrange columns order in Logs table. UIDEXP-150.
* Update `react-intl` to `v5.7.0`. UIDEXP-157.
* Fix mapping profile form validation in case of not filled transformation values.UIDEXP-166.
* Alphabetically order field names on the transformations form. UIDEXP-162.
* Fix date and time display in Safari. UIDEXP-175.
* Implement support of triggering export using CQL query files. UIDEXP-156.
* Render error logs details on the error logs page. UIDEXP-144.
* Update translations

## [2.0.1](https://github.com/folio-org/ui-data-export/tree/v2.0.1) (2020-07-09)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v2.0.0...v2.0.1)
* Fix error screen display in case of missed user information in job executions. UIDEXP-107.
* Update description and link in profiles info on the second setting's pane. UIDEXP-53.
* Display user name while viewing the mapping profile summary accordion. UIDEXP-115.
* Fix transformation labels display on mapping details view page. UIDEXP-118.
* Add long file names handling in job logs. UIDEXP-121.
* Fix drag and drop area translation. UIDEXP-123.
* Add job name display in job logs and executions. UIDEXP-116.
* Implement job profile details page. UIDEXP-86.
* Implement job profile details action menu. UIDEXP-84.
* Update translations

## [2.0.0](https://github.com/folio-org/ui-data-export/tree/v2.0.0) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v1.0.2...v2.0.0)
* Init second pane navigation in settings and link to field mapping profiles section. UIDEXP-39.
* Add static search form on field mapping profiles settings page. UIDEXP-40.
* Add static mapping profiles list to field mapping settings pane. UIDEXP-41.
* Accommodate UI to the change of the export job API endpoint. UIDEXP-44.
* Handle case when progress field is missing from log detail. UIDEXP-68.
* Add button to navigate to all logs view. UIDEXP-62.
* Update jobs list structure according to the accessibility requirements. UIDEXP-49.
* Accommodate UI to the changes in the naming convention of the file generated by export. UIDEXP-66.
* Add navigation to all logs view on view all button click. UIDEXP-63.
* Update mapping profiles container according to changes in shared components. STDTC-9.
* Add job profiles section to second pane in setting. UIDEXP-79.
* Update to Stripes v4. UIDEXP-101.
* Add mapping profiles form. UIDEXP-46.
* Implement job profiles list. UIDEXP-80.
* Accommodate UI to the changes in progress field structure for job execution. UIDEXP-106.
* Mapping profiles list - integration with backend. UIDEXP-57.
* Add job profiles form. UIDEXP-82.
* Integrate new mapping profile form with backend. UIDEXP-88.
* Job profiles list - integration with backend. UIDEXP-81.
* Implement mapping profiles form transformation fields. UIDEXP-47.
* Add Error column to the list of completed jobs. UIDEXP-97.
* Integrate new job profile form with backend. UIDEXP-85.
* Add error handling for mapping profiles saving. UIDEXP-100.
* Add transformations values saving. UIDEXP-105.
* Create a link to the files generated by exports partially completed. UIDEXP-98.
* Add progress bar to running jobs. UIDEXP-38.
* Implement selecting of the job profile before starting export. UIDEXP-87.
* Add mapping profile details. UIDEXP-50.
* Update translations

## [1.0.2](https://github.com/folio-org/ui-data-export/tree/v1.0.2) (2020-04-03)
[Full Changelog](https://github.com/folio-org/ui-data-export/tree/v1.0.1...v1.0.2)
* Provide missing "module.data-export.enabled" permission. Fixes UIDEXP-67.

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
