# GridGame

[![Build Status][travis-image]][travis-url] [![Dependency Status][dependencies-image]][dependencies-url] [![Dev dependency Status][devDependencies-image]][devDependencies-url] [![Coverage percentage][codecov-image]][codecov-url]

> A puzzel game. The objective is to make all the gray tiles green in the given amount of moves. Works on desktop and mobile.

## **Play it at: [gridgame.net](https://gridgame.net/)**

The game is built using [Typescript](https://www.typescriptlang.org/) and the HTML5 canvas element without the use of any front-end framework.

## Structure

* `server/` - Backend stuff. Slim express server serving the site and an API
* `src/`- Frontend stuff. Split into diffrent layers explined below.

### Frontend architecture

...

## Development
The `src/` folder is divided into separate concerns. 
- `domain/` - game logic
- `delivery/` - presentation layer
- `infrastructure/` - database etc.

To wath for file changes and compile as you go, run the following command:
```bash
$ npm run watch
```
If using VS Code the command is preferably run from there, `cmd+shift+b`. Then you will get Typescript errors printed in the "Problems" tab.

### Debugging
In the "Debug" tab in VS Code you can start a debugging instance of Google Canary. You can then place breakpoints in the code that will stop execution in the browser. Good stuff!

### Service worker
The site uses [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) for quicker load times and offline capabilities. The service worker script is not copied to the `dist/` folder when running `npm run watch` but if you want to bypass the service worker you can go to (in Chrome) `Dev console -> Application -> Service Workers` and check "Upload on reload" and "Bypass for network"

### Testing deployment build
Build everything and start node server
```bash
$ npm run build
$ npm start
```

## Deployment

Deployment is done automagically on Heroku. Heroku builds the site so the build folder does not need to be in the repo.

* Pushing to the `develop` branch builds the site to [dev.gridgame.net](https://dev.gridgame.net)
* Pushing to the `master` branch builds the site to [gridgame.net](https://gridgame.net)

## Tests
The tests are written in [Jest](https://jestjs.io/). Coverage report can be found [here](https://codecov.io/gh/simon-johansson/grid-game).

The following commands can be used to run tests.
```bash
$ npm run test # will run all tests once
$ npm run test-watch # will run all tests and keep doing so on each file change
$ npm run test-coverage # will run all tests once and collect a coverage report
```

## GIT Flow

### Developing features
```bash
$ git flow feature start authentication

# Develop feature. Make commits...

$ git flow feature finish authentication
```

### Making releases
```bash
$ git flow release start 0.1.0

# Bump the version number now!
# Start committing last-minute fixes in preparing your release

$ git flow release finish 0.1.0
```

Nice reference: [link](https://jeffkreeftmeijer.com/git-flow/)

[travis-image]: https://travis-ci.org/simon-johansson/grid-game.svg?branch=master
[travis-url]: https://travis-ci.org/simon-johansson/grid-game

[dependencies-image]: https://david-dm.org/simon-johansson/grid-game.svg?theme=shields.io
[dependencies-url]: https://david-dm.org/simon-johansson/grid-game

[devDependencies-image]: https://david-dm.org/simon-johansson/grid-game/dev-status.svg
[devDependencies-url]: https://david-dm.org/simon-johansson/grid-game?type=dev

[codecov-image]: https://codecov.io/gh/simon-johansson/grid-game/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/simon-johansson/grid-game
