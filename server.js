var express = require("express");
var path = require("path");
var app = express();

app.set("port", process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, "dist")));
app.use("*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

var server = app.listen(app.get("port"), function() {
  var port = server.address().port;
  console.log("Server running on port", port);
});
