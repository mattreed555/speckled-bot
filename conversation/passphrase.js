const Discord = require("discord.js");
const passphraseDb = require("./../db/passphrase-db.js");
const words = require('./../core/words.js');
const customServers = require('./../core/custom-servers.js');
const objects = words.readWordsTextWithoutSeasons("passphrase-objects").split("\n");
const adjs = words.readWordsText("passphrase-adj").split("\n");

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  s = s.trim();
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const generatePassphrase = () => {
  const obj = objects[Math.floor(Math.random() * objects.length)];
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  
  
  return capitalize(adj) + ' ' + capitalize(obj);
}

const doTheWork = async (message) => {
  
    if (customServers.getCustomGroup(message.guild.id) != "mm") {
      message.channel.send(`I have no idea what you're talking about.`);   
      return;
    }
   
    const passphrase = generatePassphrase();

    await passphraseDb.setPassPhrase(passphrase);
    
    message.channel.send(`The new pass phrase is "${passphrase}"`);   
    
   };

module.exports = (controller)=> {
  controller.hears("passphrase", "Creates a new pass phrase", doTheWork);
  controller.hears("password", "Creates a new pass phrase", doTheWork);
}