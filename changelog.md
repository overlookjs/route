# Changelog

## 0.6.5

Features:

* Export `PLUGINS` + `NAMED_PLUGINS` Symbols

Deps:

* Update `class-extension` dependency

## 0.6.4

Dependencies:

* Update `@overlook/plugin` dependency
* Update `class-extension` dependency

Dev:

* Update dev dependencies

## 0.6.3

Dependencies:

* Update dependencies

Tests:

* Code coverage cover ESM export

Dev:

* Lint `.mjs` files
* `test-prod` NPM script
* Update dev dependencies

## 0.6.2

Improvements:

* `.handle` returns undefined

## 0.6.1

Bug fixes:

* `.attachChild` accept route from any constructor

## 0.6.0

Breaking changes:

* Init methods are async
* `.extend` check for valid plugin with `Plugin.isPlugin`

Features:

* ESM export

Tests:

* Test all symbols exported

Dependencies:

* Update `is-promise` dependency

Dev:

* Update dev dependencies

Docs:

* Correct example
* Code formatting

## 0.5.1

Docs:

* Add missing changelog entry

## 0.5.0

Breaking changes:

* `app` not passed to `.init` etc

Features:

* `.root` property

Dependencies:

* Update `is-promise` dependency

Dev:

* Update dev dependencies

Docs:

* Correct code example
* Document `.parent` + `.children` properties
* Remove reference to `Overlook` core

## 0.4.1

Features:

* `isRoute` + `isRouteClass` static methods

Changes:

* Remove `[ROUTE_VERSION]` prop from prototype

Dependencies:

* Update `class-extension` dependency
* Update `@overlook/plugin` dependency

Refactor:

* Fully specify require file paths

Tests:

* Import from package name [refactor]
* Run tests on CI on Node v14
* Run tests in dev mode

No code:

* File header comments

Dev:

* Update dev dependencies
* Replace `.npmignore` with `files` list in `package.json`
* `.editorconfig` config
* Simplify Jest config
* ESLint lint dot files
* Remove unnecessary line from `.gitignore`

Docs:

* Update README
* Add missing changelog

## 0.4.0

Breaking changes:

* `.extend` expects `@overlook/plugin` plugins
* Key most methods by Symbols
* Drop support for Node v8

Performance:

* Remove `debugZone` from `initChildren`

Refactor:

* Refactor `debugZone`

Dependencies:

* Update `has-own-prop` dependency
* Update `@overlook/plugin` dependency
* Switch `core-util-is` for `is-it-type`

No code:

* NPM ignore `.DS_Store` files

Tests:

* Fix `initChildren` errors test [fix]
* Simplify unhandled rejection handling

Dev:

* Update dev dependencies
* Run tests on CI on Node v13
* Reformat Jest config
* Remove `sudo` from Travis CI config
* ESLint ignore coverage dir

Docs:

* Versioning policy
* README example correction [fix]
* README examples formatting [refactor]
* Update license year

## 0.3.1

Bug fixes:

* Correct debug context when calling `.init` method of children

Docs:

* Fix changlog [fix]

## 0.3.0

Breaking changes:

* Rename `.debugDelegate` method `.debugZone`

Features:

* `IDENTIFIER` Symbol

Docs:

* Fix missing link

## 0.2.0

Breaking changes:

* `Route.extend` drop support for multiple args
* Change debugging methods

Features:

* Add debugging instrumentation to `.init`
* Add debugging instrumentation to `.attachChild`

Bug fixes:

* Constructor initialize `.name` property

Tests:

* Simplify `attachChild` tests [refactor]
* Split `.init` + `.handle` tests into separate files [refactor]
* Rename `Route.extend` tests

Docs:

* Document all methods

## 0.1.2

Docs:

* Fix missing changelog entry

## 0.1.1

Features:

* `.debugError` method

Tests:

* Cosmetic changes

## 0.1.0

* Initial release
