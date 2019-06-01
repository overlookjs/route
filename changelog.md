# Changelog

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
