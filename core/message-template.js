const mustache = require("mustache");
const randomnessDb = require('../db/randomness-db.js');
const words = require('./../core/words.js');
const customServers = require('./../core/custom-servers.js');
const hjsonObj = words.readWordsHjson("messages");
const hjsonSansSeasonsObj = words.readWordsHjsonWithoutSeasons("messages");
const messages = hjsonObj.messages;
const messagesFallback = hjsonSansSeasonsObj.messages;
const fullMessages = [];
const reaction = require('./../core/reaction.js');    
const speckledEmoji = reaction.speckledEmoji;

const splitMessages = (messagesObj) => {
  for (const messageCollectionName in messagesObj) {
    if (messagesObj.hasOwnProperty(messageCollectionName)) {
      messageCollectionName.split(" ").forEach(function(item) {
        fullMessages[item] = messagesObj[messageCollectionName];
      });
    }
  }
}

//first add in the default messages
splitMessages(messagesFallback);

// now overlay with seasonal ones
splitMessages(messages);


const getExactMessage = function(
  value,
  minremaining,
  secremaining,
  targets,
  sender,
  template
) {
  
    
  let view = {
    minremaining: minremaining,
    secremaining: secremaining,
    targets: targets,
    sender: sender,
    thebest: "<:emoji_name:788239339846762527>",
    yas: "<:emoji_name:788423214959034379>",
    truth: "<:emoji_name:788239852411420672>",
    tick: "`"
  };
 

  if (typeof template === "string" || template instanceof String) {
    const output = mustache.render(template, view);
    return output;
  } else if (
    template.hasOwnProperty("title") &&
    template.hasOwnProperty("message")
  ) {
    let fields = [];
    if (targets !== undefined) {
      fields.push({ name: "Requested for", value: targets });
    }
    const output = mustache.render(template.message, view);

    return  {
      embeds: [{
        title:  `<:speckled:${speckledEmoji}> ` + template.title,
        color: 7054789,
        description: output,
        fields: fields
      }]
    };
  } else {
    return "";
  }
};

const getMessageList = function(  
  value,
  minremaining,
  secremaining,
  targets,
  sender,
  guild) {

    let exclude = [];
  if (minremaining === undefined || secremaining == undefined) {
    exclude.push("{{{minremaining}}}");
    exclude.push("{{{secremaining}}}");
  }
  if (targets === undefined) {
    exclude.push("{{{targets}}}");
  }
  if (sender === undefined) {
    exclude.push("{{{sender}}}");
  }
    
  const guildPrefix = "<guild:" + customServers.getCustomGroup(guild) + ">";

  let messageList = fullMessages[value].filter(template => {
    let noIllegalSubstitute = true;
    for (let excluded of exclude) {
      noIllegalSubstitute =
        noIllegalSubstitute &&
        ((typeof template === "string" && !template.includes(excluded)) ||
          (template.hasOwnProperty("message") &&
            !template.message.includes(excluded)));
    }

    
    const privateTemplate =
      (typeof template === "string" && (!template.startsWith("<guild:") || template.startsWith(guildPrefix) ) ) ||
      (template.hasOwnProperty("title") && template.hasOwnProperty("message") && 
       (!template.hasOwnProperty("guild") || (template.hasOwnProperty("guild") && template["guild"] == customServers.getCustomGroup(guild))));

    return noIllegalSubstitute && privateTemplate;
  });
    
  

  // remove our special guild tags
  messageList = messageList.map(message =>
    !message.toString().startsWith("<guild:")
      ? message
      : message.substring(message.indexOf(">") + 1)
  );
  
  return messageList;
}

const getMessages = async function(value,
  minremaining,
  secremaining,
  targets,
  sender,
  guild) {
  
    const messageList = getMessageList(
    value,
    minremaining,
    secremaining,
    targets,
    sender,
    guild);
 
  return messageList.map(template => getExactMessage(
          value,
          minremaining,
          secremaining,
          targets,
          sender,
          template));
  
};

const getMessage = async function(
  value,
  minremaining,
  secremaining,
  targets,
  sender,
  guild) {
  
  const messageList = getMessageList(
    value,
    minremaining,
    secremaining,
    targets,
    sender,
    guild);
  
  if (messageList.length == 0 )
    return ""; 
  
 const item = randomnessDb.getRandomIndex(value, messageList.length);
    
  let template = messageList[item];
  
  return getExactMessage(
    value,
    minremaining,
    secremaining,
    targets,
    sender,
    template);
  
};




const withMessages = function(doThisWithMessage) {
  for (const messageCollectionName in fullMessages) {
    doThisWithMessage(messageCollectionName);
  }
};

module.exports = {
  getMessage: getMessage,
  getMessages: getMessages,
  withMessages: withMessages
};
