# Expo Manager

a desktop application to help manage your expo projects

- [install](#install)
- [dev](#dev)
- [tests](#tests)
- [packaging](#packaging)

---

## install

`yarn install`

---

## dev

`yarn dev`

**toggle devtools:**

- osx: <kbd>cmd</kbd> <kbd>alt</kbd> <kbd>i</kbd> or <kbd>f12</kbd>
- Linux: <kbd>ctrl</kbd> <kbd>shift</kbd> <kbd>i</kbd> or <kbd>f12</kbd>
- Windows: <kbd>ctrl</kbd> <kbd>shift</kbd> <kbd>i</kbd> or <kbd>f12</kbd>

---

## tests

`yarn test`

---

## packaging

modify [electron-builder.yml](./electron-builder.yml) to edit package info. for a full list of
options see: https://github.com/electron-userland/electron-builder/wiki/Options.

**create a package for osx, windows and linux**

```
yarn pack
```

**or target a specific platform**

```
yarn pack:mac
yarn pack:win
yarn pack:linux
```

---

#### boilerplate: [electron-react-redux-boilerplate](https://github.com/jschr/electron-react-redux-boilerplate)

[![build status](https://api.travis-ci.org/jschr/electron-react-redux-boilerplate.svg)](https://travis-ci.org/jschr/electron-react-redux-boilerplate)
[![dependencies status](https://david-dm.org/jschr/electron-react-redux-boilerplate/status.svg)](https://david-dm.org/jschr/electron-react-redux-boilerplate)
[![devDependencies status](https://david-dm.org/jschr/electron-react-redux-boilerplate/dev-status.svg)](https://david-dm.org/jschr/electron-react-redux-boilerplate?type=dev)

a minimal boilerplate to get started with [electron](http://electron.atom.io/),
[react](https://facebook.github.io/react/) and [redux](http://redux.js.org/).

**including:**

- [react router](https://reacttraining.com/react-router/)
- [redux thunk](https://github.com/gaearon/redux-thunk/)
- [redux actions](https://github.com/acdlite/redux-actions/)
- [redux local storage](https://github.com/elgerlambert/redux-localstorage/)
- [electron packager](https://github.com/electron-userland/electron-packager)
- [electron devtools installer](https://github.com/MarshallOfSound/electron-devtools-installer)
- [electron mocha](https://github.com/jprichardson/electron-mocha)
- [browsersync](https://browsersync.io/)
