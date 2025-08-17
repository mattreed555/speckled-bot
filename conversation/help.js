const Discord = require("discord.js");
const customServers = require('./../core/custom-servers.js');
const words = require('./../core/words.js');
const help = words.readWordsHjson("help");
const reaction = require('./../core/reaction.js');    
const speckledEmoji = reaction.speckledEmoji;

const getResult = function(guild) {
  const result = help.
filter(f => (!f.hasOwnProperty("guild") || (f.hasOwnProperty("guild") && f.guild == customServers.getCustomGroup(guild)))).
map(h => {

  const name = h.name;
  const value = h.description + 
        (h.hasOwnProperty('example') && h.example.length > 0 ? 
           "\nExample:\n```" + h.example + "```" : 
           "");
  
  return {
          name: name,
          value: value
         }; 

});

 
  return {
    "embeds": [{
      "title": `<:speckled:${speckledEmoji}> Speckled BOT Help`,
      "color": 7054789,
      "fields": result
    }]
  };
}

module.exports = (controller)=> {
  controller.hears("help", "", (message) => {
      message.channel.send(getResult(message.guild.id));    
   }); 
}