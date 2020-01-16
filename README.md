# ui-data-export

Copyright (C) 2020 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

Application for data export functionality.

## Installation

First, a Stripes UI development server needs to be running. See the [quick start](https://github.com/folio-org/stripes-core/blob/master/doc/quick-start.md) instructions, which explain how to run it using packages from the FOLIO NPM repository or use some parts from local in-development versions.

The other parts that are needed are the Okapi gateway, various server-side modules, and sample data. Ways to achieve that are described in [Running a complete FOLIO system](https://github.com/folio-org/ui-okapi-console/blob/master/doc/running-a-complete-system.md).

(At some point, this process will be dramatically streamlined; but at present, this software is primarily for developers to work on, rather than for users to use.)

## Build and serve

To build and serve `ui-data-export` in isolation for development purposes, run the "start" package script.
```
$ yarn start
```

The default configuration assumes an Okapi instance is running on _http://localhost:9130_ with tenant _diku_.  The options `--okapi` and `--tenant` can be provided to match your environment.
```
$ yarn start --okapi http://localhost:9130 --tenant diku
```

See the [serve](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#serve-command) command reference in `stripes-cli` for a list of available options.  Note: _stripes-cli_ options can be persisted in [configuration file](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#configuration) for convenience.

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UIDEXP](https://issues.folio.org/projects/UIDEXP)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
