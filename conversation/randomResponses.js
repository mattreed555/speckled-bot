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
    value,
    "Provides a random interesting message.",
    async message => {
      
      const recipients = getNamedRecipients(message, value);
      let sprintMessage = "";
      if (recipients.length == 0) {
        sprintMessage = await sprint.getSprintMessageIfSprinting(
          message,
          value
        );
      }
      if (sprintMessage.length > 0) {
        message.channel.send(sprintMessage);
      } else {
        let sender = message.author.toString();
        let target =
          recipients.length == 0 ? sender.toString() : recipients.join(", ");

        const output = await template.getMessage(
          value,
          undefined,
          undefined,
          target,
          sender,
          message.guild.id
        );
        if (output !== "") {;
          message.channel.send(output);
        }
        else {
          message.channel.send(
            `Hi, ${message.author}! You said my name! But unfortunately I dont know what you're asking. Say my name and help to learn what I can do.`
          );

        }
      }
    }
  );
};

module.exports = controller => {
  withMessages(function(item, messages) {
      if (!exclude.includes(item)) {
        setupRandomReply(controller, item);
      }
   });
};
