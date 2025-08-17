const { promises: fs } = require("fs");
const fss = require("fs");
const words = require('./../core/words.js');
const filePath = '.data/exclusions.txt';


const getExclusions = () => {
  
  if (fss.existsSync(filePath)) {
    return fss.readFileSync(filePath, "utf-8" );
  }
  else {
    return "";
  }
}



const getActiveEvents = () => {
  
  
    const events = words.readWordsHjsonWithoutSeasons("events");
    const exclusions = getExclusions().split("\n");
    let newEvents = [];
    for (const event of events) {

      

      if( exclusions.indexOf(event.id) < 0) {
        
        var messagePrefix = "Speckled Alert";
        
        if (event.hasOwnProperty('prefix') && event.prefix !== undefined && event.prefix !== "") {
            messagePrefix = event.prefix;
        }
        
        var message = messagePrefix + ": " + event.message;
        
         newEvents.push({id:event.id,scheduledTime:new Date(event.scheduledTime),guild:event.guild, channel:event.channel, message:message});
      }
    }

  return newEvents;
}

const excludeEvent = (event) => {
  const exclusions = getExclusions();
  const newVal = (exclusions.length > 0) ? exclusions + "\n" + event.id : event.id;
  fss.writeFileSync(filePath, newVal, { encoding:"utf-8" });
}
  


module.exports = {
  getActiveEvents: getActiveEvents,
  excludeEvent: excludeEvent
};