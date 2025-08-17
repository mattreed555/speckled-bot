const Discord = require("discord.js");
const mentions = require('./../core/mentions.js');
const words = require('./../core/words.js');
const costumeData = words.readWordsHjsonWithoutSeasons("fall/costume");

const generateCostume = () => {
  const obj = costumeData.costume[Math.floor(Math.random() * costumeData.costume.length)];
  const adj = costumeData.adj[Math.floor(Math.random() * costumeData.adj.length)];
  
  return adj + " " + obj;
}

const doTheWork = async (message) => {
  
   const targets = mentions.getMessageTargets(message).reverse();
  
   for (const person of targets) { 
     const newCostume = generateCostume();
     message.channel.send(`${person}: you should dress up as ${newCostume}`);   
   }
};

module.exports = (controller)=> {
  controller.hears("costume", "Creates a new costume", doTheWork);
}