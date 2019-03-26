var fs = require("fs");
var path = require("path");
var Trello = require("trello");
var trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);
var trelloBoardID = "5b9f603593bffd03956e8d51";
var trelloListID = "5c5f46f07c34346e76375471";
var fileName = "levels.json";
var cachedLevels;

function getLevels() {
  if (process.env.DOWNLOAD_LEVELS == "true") {
    return checkConnection().then(isOnline => (isOnline ? getLevelsFromTrello() : getLevelsFromFile()));
  }
  return getLevelsFromFile();
}

// getLevels().then((data) => {
//   console.log(data);
// })

function checkConnection() {
  return new Promise(resolve => {
    require("dns").lookup("google.com", function(err) {
      if (err && err.code == "ENOTFOUND") resolve(false);
      else resolve(true);
    });
  });
}

function saveLevels() {
  getLevelsFromTrello().then(data => {
    fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data, null, 2), "utf8", err => {
      if (err) console.error(err);
      console.log(`Saved ${fileName}`);
    });
  });
}

async function getLevelsFromTrello() {
  console.info("Getting levels from Trello");
  return await trello.getCardsOnList(trelloListID).then(cards => {
    return cards.map(card => {
      const level = JSON.parse(card.desc);
      level.id = card.id;
      return level;
    });
  });
}

function getLevelsFromFile() {
  return new Promise((resolve, reject) => {
    if (cachedLevels) {
      console.info("Getting levels from cached file");
      return resolve(cachedLevels);
    }
    fs.readFile(path.join(__dirname, fileName), function read(err, data) {
      if (err) return reject(err);
      console.info("Getting levels from file");
      cachedLevels = JSON.parse(data);
      resolve(cachedLevels);
    });
  });
}

module.exports = { getLevels, saveLevels };
