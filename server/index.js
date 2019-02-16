var express = require("express");
var path = require("path");
var app = express();
var { getLevels } = require('./trello');
var port = process.env.PORT || 8070;

app.set("port", port);
app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/levels", function(req, res) {
  getLevels().then(levels => {
    res.json(levels);
  })
});

app.use("/", function(req, res) {
  res.sendFile(path.join(__dirname,  "..", "dist", "index.html"));
});

app.listen(port, function() {
  console.log("Server running on port", port);
});
