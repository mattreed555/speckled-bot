const fs = require("fs");
const hjson = require("hjson");
const d = new Date();
const n = d.getMonth();

// fix this!
const addSeasonalPostfix = (basename, path, postfix, withSeason) => {
  if (withSeason) {
    switch (n) {
      case 0:
      case 1:
        const winterName = path + 'winter/' + basename + "." + postfix;
        if (fs.existsSync(winterName)) {
          return winterName;
        }
        break;
        
      case 5:
        const juneName = path + 'june/' + basename + "." + postfix;
        if (fs.existsSync(juneName)) {
          return juneName;
        }
        break;
        
      case 9:
        const fallName = path + 'fall/' + basename + "." + postfix;
        if (fs.existsSync(fallName)) {
          return fallName;
        }
        break;
     }
  }
  
  return path + basename + "." + postfix;
};

const getHjson = (basename, withSeason) => {
   const fileToGet = addSeasonalPostfix(basename, './words/', 'hjson', withSeason);
   const hjsonText = fs.readFileSync(fileToGet, "utf8");
   return hjson.parse(hjsonText);  
};

const getText = (basename, withSeason) => {
   const fileToGet = addSeasonalPostfix(basename, './words/', 'txt', withSeason);
   return fs.readFileSync(fileToGet, "utf8");  
};


module.exports = {
 readWordsHjson: function(basename) {
   return getHjson(basename, true);
   
 },
  readWordsText: function(basename) {
   return getText(basename, true);
 },
  readWordsHjsonWithoutSeasons: function(basename) {
   return getHjson(basename, false);
   
 },
  readWordsTextWithoutSeasons: function(basename) {
   return getText(basename, false);
 },
};