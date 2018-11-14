# [![Build Status][travis-image]][travis-url] [![Dependency Status][dependencies-image]][dependencies-url] [![Dev dependency Status][devDependencies-image]][devDependencies-url] [![Coverage percentage][codecov-image]][codecov-url]


## Usage
Start developing in the **src/** directory. The structure will be preserved and all files and compilations are copied to the output directory **bin/**.

To start a local server and watch the *dist/* directory just call
```
npm start
```

### Scripts
Watching all files
```
npm run watch:*
```

Build all files
```
npm build
```

Run a local server
```
npm run serve
```

### Things

* require.js
* Heroku
* URL
* vscode tasks for building and testing
* "Baypass for network" to work without service workers

# Todo
- uglify

[travis-image]: https://travis-ci.org/simon-johansson/grid-game.svg?branch=master
[travis-url]: https://travis-ci.org/simon-johansson/grid-game

[dependencies-image]: https://david-dm.org/simon-johansson/grid-game.svg?theme=shields.io
[dependencies-url]: https://david-dm.org/simon-johansson/grid-game

[devDependencies-image]: https://david-dm.org/simon-johansson/grid-game/dev-status.svg
[devDependencies-url]: https://david-dm.org/simon-johansson/grid-game?type=dev

[codecov-image]: https://codecov.io/gh/simon-johansson/grid-game/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/simon-johansson/grid-game
