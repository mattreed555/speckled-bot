const Discord = require("discord.js");
const template = require("./../core/message-template.js");
const withMessages = template.withMessages;
const words = require('./../core/words.js');
const dogs = words.readWordsHjsonWithoutSeasons("dog-friends");
const sprint = require("./../core/sprint.js");

const exclude = ["end", "time", "start"];

const getNamedRecipients = function(message, item) {
  let users = message.mentions.users
    .map ( u => u.toString());
  
  let mentionPossibilities = dogs.concat(users); 

  
  const words = message.content.trim().replace(/\!/g,"").replace(/,/g,"").replace(/;/g,"").toLowerCase().split(/ +/g);

  words.shift();
  words.shift();


  const vals = mentionPossibilities
      .filter(s => words.includes(s.toLowerCase()));
  
  
  return vals;
  
};

const setupRandomReply = function(controller, value) {
  
  
  controller.hears(
    "test-" + value,
    "Provides a random interesting message.",
    async message => {
      
    if (message.guild.id != "780070500331683870") {
      message.channel.send(`I have no idea what you're talking about.`);   
      return;
    }
      
      const recipients = getNamedRecipients(message, value);

       let sender = message.author.toString();
        let target =
          recipients.length == 0 ? sender.toString() : recipients.join(", ");

        const messages = await template.getMessages(
          value,
          "44 minutes",
          "13 seconds",
          target,
          sender,
          message.guild.id
        );
     
      for (let i = 0; i < messages.length; i++) {
        const output = messages[i];
         if (output !== "") {
            message.channel.send(output);
          }
        
      } 
     
    }
  );
};

module.exports = controller => {
  withMessages(function(item, messages) {
      setupRandomReply(controller, item);
   });
};
