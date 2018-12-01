var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 8080;

app.set("port", port);
app.use(express.static(path.join(__dirname, "dist")));
app.use("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, function() {
  console.log("Server running on port", port);
});
