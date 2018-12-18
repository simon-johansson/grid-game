var fs = require("fs");

var REGEX = /REPLACE_IN_BUILD_STEP/g;
var path = "./dist/service-worker.js";

var fileContent = fs.readFileSync(path, "utf8");
fileContent = fileContent.replace(REGEX, function () {
  return '_' + Math.random().toString(36).substr(2, 9);
});
fs.writeFileSync(path, fileContent);
