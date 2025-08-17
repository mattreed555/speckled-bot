const words = require('./../core/words.js');
const reactions = words.readWordsHjson("reactions").reactions;
const passphraseDb = require('../db/passphrase-db.js');
const customServers = require('./../core/custom-servers.js');
const getSpeckledEmoji = () => {
  if (reactions.hasOwnProperty("speckled") && 
      reactions["speckled"].length > 0) {
    return reactions["speckled"][0];
  }
  return '🥚';
};

const speckledEmoji =  getSpeckledEmoji();
const handleReactions = function(message) {
  
    if (customServers.getCustomGroup(message.guild.id) != "mm") {
      return;
    }
  
    const passphrase = passphraseDb.getPassPhrase();

    const messageText = message.content.toLowerCase();
  
    if(messageText.includes(passphrase.toLowerCase())) {
      message.react(speckledEmoji);
    }
    
    const wordsInMessageText = messageText.replace(/[^\w\s]|_/g, "")
             .split(' ');
  
      for (const reactionCollectionName in reactions) {
        if (reactions.hasOwnProperty(reactionCollectionName)) {
          if(wordsInMessageText.includes(reactionCollectionName)) {
            const reactionList = reactions[reactionCollectionName];
            const template = reactionList[Math.floor(Math.random() * reactionList.length)];
            message.react(template);
          }
        }
      }
      
};



module.exports = {
  handleReactions:handleReactions,
  speckledEmoji:speckledEmoji
}