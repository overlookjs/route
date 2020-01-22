[![NPM version](https://img.shields.io/npm/v/@overlook/route.svg)](https://www.npmjs.com/package/@overlook/route)
[![Build Status](https://img.shields.io/travis/overlookjs/route/master.svg)](http://travis-ci.org/overlookjs/route)
[![Dependency Status](https://img.shields.io/david/overlookjs/route.svg)](https://david-dm.org/overlookjs/route)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/route.svg)](https://david-dm.org/overlookjs/route)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookjs/route.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/route/master.svg)](https://coveralls.io/r/overlookjs/route)

# Overlook framework Route class

Part of the [Overlook framework](https://overlookjs.github.io/).

## Abstract

This module exports the base `Route` class, which all routes should be instances of. It is also exported as `Overlook.Route`.

Overlook handles routes by building them in a tree. Each route can either handle a request itself or pass the request on to child routes to handle.

A route can have functionality added by either:

1. Adding properties and methods to a `Route` instance
2. Using plugins (see [here](#plugins))

## Usage

### Constructor

Create a route:

```js
const Route = require('@overlook/route');
const route = new Route();
```

This route is not connected to the router tree. It will need to be [connected](#building-a-router-tree) to be useful.

#### Properties

Properties to add to the `Route` instance can be passed as an object to the constructor.

```js
const route = new Route( { a: 123 } );
// route.a === 123
```

All routes except root should add a `name` property to improve [debugging](#debugging) experience.

```js
const route = new Route( { name: 'myRoute' } );
```

#### Subclassing

`Route` can be subclassed to add additional methods, or extend existing ones.

```js
class MyRoute extends Route {
  // New method
  myMethod() { /* ... */ }

  // Extending existing method
  initRoute( app ) {
    super.initRoute( app );
    /* ... */
  }
}
```

### Methods

`Route` has the following instance methods:

* [`.initProps( props )`](#initialization)
* [`.init( app )`](#initialization)
* [`.initRoute( app )`](#initialization)
* [`.initChildren( app )`](#initialization)
* [`.handle( req )`](#route-handle-req)
* [`.attachChild( child )`](#building-a-router-tree)
* [`.attachTo( parent )`](#attachto-parent)
* [`.debugError( err )`](#debugging)
* [`.debugZone( fn )`](#debugging)

and one static method:

* [`Route.extend( plugin )`](#plugins)

### Handling requests

#### `route.handle( req )`

`route.handle()` is used to ask the route to handle a request.

The `.handle()` method provided by `Route` class does nothing and returns `null`.

This method is intended to be extended in routes or plugins, to add functionality for the particular behavior of the route.

#### Delegation to children

`.handle()` may handle the request itself or delegate handling to one of its children. Delegation to children is implemented in plugins such as [@overlook/plugin-match](https://www.npmjs.com/package/@overlook/plugin-match) and [@overlook/plugin-path](https://www.npmjs.com/package/@overlook/plugin-path).

#### Return value

If the route does not handle the request (for example the request doesn't match a path that the route handles), it should return `null`.

If it *does* handle the request (including handling by a child which it delegates to), it should return any value other than `null` and `undefined`.

Typically, requests will be handled asynchronously. In that case `.handle()` should return a Promise.

NB a Promise is a non-null value and therefore it's considered that the route has handled the request, regardless of whether the Promise's resolution is `null` or not.

### Building a router tree

#### `.attachChild( child )`

Routes can be constructed into a tree using `.attachChild()`.

One route serves as the root, and it can have multiple children. Children can have their own nested children, which have their own children, and so on.

```js
const root = new Route();
const child = new Route();
root.attachChild( child );

const childOfChild = new Route();
child.attachChild( childOfChild );
```

#### `.attachTo( parent )`

This method should not be called directly. It is called by `.attachChild()`.

The method is exposed to allow it to be extended by subclasses.

### Initialization

When a route is created, it is initially not linked to the router tree and must be [added later](#building-a-router-tree).

Properties can be added via the constructor, or manually, but often the route will behave differently depending on what its parent is, or global state, which is only available once the router tree has been built.

#### `.init( app )`

`.init()` should be called on the root route once the whole router tree is built.

`app` is the Overlook app, and contains global state.

`.init()` will call `.initRoute()`, followed by `.initChildren()`. `.initChildren()` will call the `.init()` method of all children in series. So calling `.init()` on the root route will cause `.init()` to be called on all routes in the whole router tree.

`.init()` should not be extended in subclasses - extend `.initRoute()` or `.initChildren()` instead.

#### `.initRoute( app )`

Should not be called directly. Is called automatically by `.init()`.

The `.initRoute()` method provided by `Route` class does nothing.

To add init actions to your route, extend `.initRoute()`:

```js
class MyRoute extends Route {
  initRoute( app ) {
    super.initRoute( app );
    /* ... */
  }
}

const route = new MyRoute();
```

#### `.initChildren( app )`

Should not be called directly. Is called automatically by `.init()`.

It is exposed for extension in subclasses where there is some initialization which needs to happen after all children are initialized.

```js
class MyRoute extends Route {
  initChildren( app ) {
    super.initChildren( app );

    // Children are initialized now
    /* ... */
  }
}
```

Extend `.initRoute()` instead if the action doesn't require the children to be initialized.

#### `.initProps( props )`

Should not be called directly. Is called automatically by class constructor *before* any properties provided to constructor are added to the route object.

`.initProps()` can be extended to initialize properties to `undefined`, to ensure all route objects are the same "shape", allowing Javscript engines to better optimize.

It **should not** be used to set default values. Do that in `.initRoute()` instead.

```js
class MyRoute extends Route {
  initProps( props ) {
    super.initProps( props );
    // Initialize to undefined
    this.myProp = undefined;
  }

  initRoute( app ) {
    super.initRoute( app );
    // Set default if not defined
    if (this.myProp === undefined) this.myProp = 1;
  }
}

const routeWithDefinedProp = new MyRoute( { myProp: 2 } );
// routeWithDefinedProp.myProp === 2

const routeWithDefaultProp = new MyRoute();
routeWithDefaultProp.init();
// routeWithDefaultProp.myProp === 1
```

### Plugins

#### Introduction

Overlook is intended to be extremely modular and flexible.

The base `Route` class has very little functionality, and most functionality is intended to be added using plugins.

Plugins are similar to those used by other frameworks, but the main difference is this:

> Plugins apply at route level, not application level.

One route, or subtree of routes, can have one behavior, another subtree can have another. So, for example, one part of the app can use [React](https://reactjs.org/), another part can server-render pages from [EJS](https://ejs.co/) templates.

This architecture allows:

1. "Snap in" plugins providing common functionality, making building apps fast
2. Granular control over every route's individual behavior

#### Creating a plugin

Plugins are created with [@overlook/plugin](https://www.npmjs.com/package/@overlook/plugin) class.

Plugins define an `extend` function, which receives a `Route` class and should return a subclass of it.

```js
const Plugin = require('@overlook/plugin');

const loggingPlugin = new Plugin( Route => (
  class extends Route {
    handle( req ) {
      console.log(`Handling request ${req.path}`);
      const res = super.handle( req );
      console.log(`Handled request ${req.path}`);
      return res;
    }
  }
) );
```

New methods and properties should have Symbol keys, not strings. If properties are intended to be accessed by other plugins, or methods intended to be available for extending, the Symbols should be exported as a properties of the plugin.

For more info on creating plugins please see [here](https://www.npmjs.com/package/@overlook/plugin).

#### Using plugins

`Route.extend( plugin )` static method is used to apply a plugin to a `Route` class.

It returns a subclass of the original Route class. *It does not mutate the original Route class*.

```js
const RouteWithLogging = Route.extend( loggingPlugin );
```

Multiple plugins can be chained:

```js
const RouteWithLoggingAndAuth =
  Route.extend( loggingPlugin )
    .extend( authPlugin );
```

#### Plugins extending other plugins

Plugins can themselves utilise other plugins, using `.extend()`.

```js
const myPlugin = new Plugin( (Route) => {
  const RouteWithLogging = Route.extend( loggingPlugin );

  return class extends RouteWithLogging {
    /* ... other extensions ... */
  };
} );
```

#### Optimizations

Overlook's plugin system applies a couple of optimizations:

##### Avoid extending twice

Many plugins depend on other plugins in turn. So it'd be easy to end up the same plugin being applied more than once, and ending up with:

```js
Route.extend( plugin1 )
  .extend( plugin2 )
  .extend( plugin1 );
```

This is likely to lead to incorrect behavior. So `Route.extend()` checks if a plugin has already been applied, and if so does not apply it again.

##### Deduplicating subclasses

`.extend()` is memoized. If the same plugin is applied to the same route class in multiple places, it always returns the same subclass.

```js
const RouteSubclass1 = Route.extend( loggingPlugin );
const RouteSubclass2 = Route.extend( loggingPlugin );
RouteSubclass1 === RouteSubclass2 // -> true
```

### Debugging

#### The problem

The majority of the functionality of an Overlook app will likely be provided by plugins.

So if an error is thrown, the stack trace will likely point to a file which is inside a plugin NPM module. Additionally, delegating actions up through the router tree is also performed within plugin methods, so the stack trace likely won't include any info allowing you to trace what route the error came from.

This is not very helpful for debugging.

#### Solution

`Route` instances have 2 methods which add debug info to errors, `.debugError()` and `.debugZone()`.

Any errors thrown will be tagged with:

1. Router path added to the end of error message `'... (router path /abc/def)'`
2. Router path recorded on the error object as `error[ROUTER_PATH]`

`ROUTER_PATH` is a symbol exported as `Route.ROUTER_PATH`.

#### When to use these methods

These methods are already built in to `.init()` and `.attachChild()`.

Any error thrown in `.init()`, `.initRoute()`, `.initChildren()`, `.attachChild()` or `.attachTo()` will be caught and tagged with debug info as above. You don't need to use the debug methods to get the debug info.

If you create a plugin which passes control from one route to another - for example, delegating to children - use `.debugZone()` to wrap that call (see [below](#debugzone-fn)).

If you create a plugin which could provide some additional debug info, use `.debugError()` to add that info to the error object (see [below](#debugerror-err)).

#### When not to use these methods

It's only required where contol passed from one route to another. Mostly you won't be doing that, so generally there's no need to use the debug methods.

#### `.debugZone( fn )`

Executes a function within debug context of the route. Any errors thrown will be tagged with the debug info for that route.

If you want to extend `.handle()` to delegate handling requests to the route's children:

```js
class MyRoute extends Route {
  handle( req ) {
    let res = super.handle( req );
    if (res) return res;

    // First child which returns non-null value has handled request
    for (let child of this.children) {
      res = child.debugZone( () => {
        return child.handle( req );
      } );
      if (res != null) break;
    }

    return res;
  }
}
```

#### `.debugError( err )`

`.debugError()` is called by `.debugZone()` with any error which occurs in the route. `.debugError()` adds debug info to the error (as described above).

You can extend `.debugError()` to add further debugging info.

```js
const FILE_PATH = Symbol('FILE_PATH');

class MyRoute extends Route {
  // ... some methods which define this[FILE_PATH] ...

  debugError( err ) {
    err = super.debugError( err );
    err[FILE_PATH] = this[FILE_PATH];
    err.message += ` (file path ${this[FILE_PATH]})`;
    return err;
  }
}
```

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/route/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/route/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
