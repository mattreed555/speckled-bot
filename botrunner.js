const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });


const fs = require("fs");

const reactions = require('./core/reaction.js');    

const convoMap = new Map();
const convoDefaultMap = [];

// MAKE THIS LOOK UP

const serverNameMap = require('./core/custom-servers.js').getFriendlyNameMap;

const sendLog = (guild, cmd) => {
  const serverFriendlyName = serverNameMap(guild);
  console.log("HELLO! " + ((serverFriendlyName === undefined) ? guild : serverFriendlyName) + cmd);
};

const convoHears = (command, help, func) => {
  convoMap.set(command, { help: help, action: func });
};

const convoDefault = (func) => {
  convoDefaultMap.push(func);
};


function startServer() {
  

 

  fs.readdir("./conversation/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./conversation/${file}`);
      event({
        hears: convoHears,
        default: convoDefault
      });
    });
  });
  
  

  fs.readdir("./cron/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./cron/${file}`);
      event();
    });
  });
  

    
    

  // clean this function up
  client.on("messageCreate", async message => {

      console.log('message');
    
    // ignore messages from other bots  or non-guild messages (not that I'm sure how to do that)
    if (message.author.bot || 
        !message.guild) return;

    if (!message.member) 
      await message.guild.members.fetch(message.author);
   
    const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
    if (message.content.match(prefixMention)) {
      const args = message.content.trim().split(/ +/g);
      args.shift(); // remove the bot name
      const cmd = args.length > 0 ? args.shift().toLowerCase():"";

      sendLog(message.guild.id, cmd);
      
      if (convoMap.has(cmd)) {
          convoMap.get(cmd).action(message);
      } 
      else {
          if (convoDefaultMap.length > 0) {
            for (const func of convoDefaultMap) {
              await func(message);
            }
          }
          else {
            message.channel.send(
              `Hi, ${message.author}! You said my name! But unfortunately I dont know what you're asking. Say my name and help to learn what I can do.`
            );
          }
        }
            
    }
 
    reactions.handleReactions(message);


  });
  
  client.on('ready', () => {
	console.log('Ready!');
});


   
  client.login(process.env.DISCORD_TOKEN).catch(console.error);
  
}

module.exports = {
  start: startServer
};
