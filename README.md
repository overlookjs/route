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
2. Using Route class extensions (see [here](#route-class-extensions))

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

* [`Route.extend( extension )`](#route-class-extensions)

### Handling requests

#### `route.handle( req )`

`route.handle()` is used to ask the route to handle a request.

The `.handle()` method provided by `Route` class does nothing and returns `null`.

This method is intended to be extended in routes or Route class extensions, to add functionality for the particular behavior of the route.

#### Delegation to children

`.handle()` may handle the request itself or delegate handling to one of its children. Delegation to children is implemented in Route class extensions such as [@overlook/router-match](https://www.npmjs.com/package/@overlook/router-match) and [@overlook/router-path](https://www.npmjs.com/package/@overlook/router-path).

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

### Route class extensions

#### Introduction

Overlook is intended to be extremely modular and flexible.

The base `Route` class has very little functionality, and most functionality is intended to be added using extensions.

Extensions are much like "plugins", which other frameworks use, but the main difference is this:

> Route class extensions apply at the route level, not application level.

One route, or subtree of routes, can have one behavior, another subtree can have another. So, for example, one part of the app can use [React](https://reactjs.org/), another part can server-render pages from [EJS](https://ejs.co/) templates.

This architecture allows:

1. "Snap in" extensions providing common functionality, making building apps fast
2. Granular control over every route's individual behavior

#### Anatomy of an extension

A Route class extension is a function which receives a `Route` class and should return a subclass of it.

```js
const TYPE = Symbol('TYPE'),
  TELL_ME_ABOUT_YOURSELF = Symbol('TELL_ME_ABOUT_YOURSELF');

const animalExtension = function(Route) {
  return class AnimalRoute extends Route {
    initProps( props ) {
      super.initProps( props );
      this[TYPE] = undefined;
    }

    init( app ) {
      super.init( app );
      if (this[TYPE] === undefined) this[TYPE] = 'mammal';
    }

    [TELL_ME_ABOUT_YOURSELF]() {
      return `I am a ${this[TYPE]}`;
    }
  }
};

animalExtension.IDENTIFIER = Symbol('ANIMAL_ROUTE');
animalExtension.TYPE = TYPE;
animalExtension.TELL_ME_ABOUT_YOURSELF = TELL_ME_ABOUT_YOURSELF;
```

All extensions should have an `.IDENTIFIER` property defined as a Symbol.

New methods and properties should have Symbol keys, not strings. If properties are intended to be accessed by other extensions, or methods intended to be available for extending, the symbol should be exported as a property of the extension.

#### `Route.extend( extension )`

`Route.extend()` static method is used to apply an extension to a `Route` class.

```js
const AnimalRoute = Route.extend( animalExtension );
```

Multiple extensions can be chained:

```js
const MonkeyRoute = Route.extend( animalExtension )
  .extend( monkeyExtension );
```

#### Why not just call the extension function directly?

```js
// DO NOT DO THIS!
const AnimalRoute = animalExtension( Route );
```

`Route.extend()` does a bit of extra processing. It:

##### 1. Adds `[IDENTIFIER]` to both the Route subclass and its prototype.

So if you want to know if a route is has been made from `animalExtension`, you can do:

```js
if (route[animalExtension.IDENTIFIER]) {
  console.log('This route is an animal');
}
```

##### 2. Avoid extending twice

Many extensions depend on other extensions in turn. So it'd be easy to end up the same extension being applied more than once, and ending up with:

```js
Route.extend( extension1 )
  .extend( extension2 )
  .extend( extension1 );
```

This is likely to lead to incorrect behavior. So `Route.extend()` checks if an extension has already been applied, and if so does not apply it again.

##### 3. Memoize subclass creation

If you have a bunch of routes using the same extension, it would create a bunch of identical but separate subclasses, which would consume memory for no gain.

```js
// DO NOT DO THIS
const AnimalRoute1 = animalExtension( Route );
const AnimalRoute2 = animalExtension( Route );
// AnimalRoute1 !== AnimalRoute2
```

`Route.extend()` memoizes the extension. Given the same input, you get the same output - the same subclass.

```js
const AnimalRoute1 = Route.extend ( animalExtension );
const AnimalRoute2 = Route.extend ( animalExtension );
// AnimalRoute1 === AnimalRoute2
```

#### Extending an extension

Extensions can depend on other extensions. They can use `Route.extend()` themselves. e.g.:

```js
const animalExtension = require(/* ... */);
const {TELL_ME_ABOUT_YOURSELF} = animalExtension;

const monkeyExtension = function(Route) {
  Route = Route.extend( animalExtension );

  return class MonkeyRoute extends Route {
    [TELL_ME_ABOUT_YOURSELF]() {
      const message = super[TELL_ME_ABOUT_YOURSELF]();
      return `${message} and I am a monkey`;
    }
  }
};

monkeyExtension.IDENTIFIER = Symbol('MONKEY_ROUTE');
```

#### What's with all the Symbols?

To avoid namespacing issues.

If two different extensions both set a property `.type` on a route, they'll overwrite each other and cause malfunctions. Similarly, two extensions might define a method `.doSomething()` and those methods will clash.

Using Symbols prevents any clashes. Both extensions define a Symbol `TYPE` which is local to that extension and they both use `route[TYPE]` rather than `route.type`. The two properties will be kept separate and won't clash.

Extensions export the Symbols they use, so they can be used to look up properties or call methods relating to that extension.

### Debugging

#### The problem

The majority of the functionality of an Overlook app will likely be provided by Route class extensions.

So if an error is thrown, the stack trace will likely point to a file which is inside an extension NPM module. Additionally, delegating actions up through the router tree is also performed within extension methods, so the stack trace likely won't include any info allowing you to trace what route the error came from.

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

If you create an extension which passes control from one route to another - for example, delegating to children - use `.debugZone()` to wrap that call (see [below](#debugzone-fn)).

If you create an extension which could provide some additional debug info, use `.debugError()` to add that info to the error object (see [below](#debugerror-err)).

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
      res = child.debugZone(() => {
        return child.handle( req );
      });
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
