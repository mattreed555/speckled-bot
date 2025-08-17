const nopt = require("nopt");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const eventsDb = require("./../db/events-db.js");

const doStuff = async () => {
  const events = eventsDb.getActiveEvents();
  const whenIsNow = new Date();
  for (const event of events) {
    
    if (event.scheduledTime.getTime() < whenIsNow.getTime()) {
      
      console.log("FOUND!");
      
      await client.guilds
      .fetch(event.guild)
      .then(guild =>
        {
        
         console.log("GUILD!");
        
        client.channels
          .fetch(event.channel)
          .then(channel => {
            channel.send(event.message);
            eventsDb.excludeEvent(event);
          })
          .catch(console.log);
        
      }
      )
      .catch(error => {
       console.error("Error:", error);
       });
      
    }
  }
      
};

module.exports = {
  handleEvents: doStuff,
};
