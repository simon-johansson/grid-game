var express = require("express");
var path = require("path");
var app = express();

function sslRedirect(environments) {
  environments = environments || ["production"];
  return function(req, res, next) {
    if (environments.indexOf(process.env.NODE_ENV) >= 0) {
      if (req.headers["x-forwarded-proto"] != "https") {
        res.redirect(301, "https://" + req.hostname + req.originalUrl);
      } else next();
    } else next();
  };
}

app.set("port", process.env.PORT || 8080);

app.use(sslRedirect());

app.use(express.static(path.join(__dirname, "dist")));

app.use("*", function(req, res) {
  res.sendFile(__dirname, "dist", "index.html");
});

var server = app.listen(app.get("port"), function() {
  var port = server.address().port;
  console.log("Server running on port", port);
});
