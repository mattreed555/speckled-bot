const fs = require("fs");
const hjson = require("hjson");
const hjsonDogText = fs.readFileSync("./words/dog-friends.hjson", "utf8");
const dogs = hjson.parse(hjsonDogText);



const getNamedRecipients = function(message) {
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

const getMessageTargets = function(message) {
  const recipients = getNamedRecipients(message);
  
  if (recipients.length == 0) {
    const sender = message.author.toString();
    recipients.push(sender); 
  }
  
  return recipients;
}


module.exports = {
 getMessageTargets: getMessageTargets,
 getNamedRecipients: getNamedRecipients
};