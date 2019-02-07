// This script creates new cache IDs for the service worker so that
// the service workers that are already in use knows to update when a
// new version of the game has been deployed.

var fs = require("fs");

var REGEX = /REPLACE_IN_BUILD_STEP/g;
var path = "./dist/service-worker.js";

var fileContent = fs.readFileSync(path, "utf8");
fileContent = fileContent.replace(REGEX, function () {
  return '_' + Math.random().toString(36).substr(2, 9);
});
fs.writeFileSync(path, fileContent);
