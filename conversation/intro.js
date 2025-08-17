const Discord = require("discord.js");
const reaction = require('./../core/reaction.js');    
const speckledEmoji = reaction.speckledEmoji;

module.exports = (controller)=> {
  controller.hears("intro", "I'll introduce myself.", (message) => {
    let sender = message.author.toString();
    const embed = new Discord.MessageEmbed();
    embed.setTitle(`<:speckled:${speckledEmoji}> Speckled BOT Intro`);
    embed.setDescription(`👋 ${sender}. I'm Speckled BOT. I contain multitudes.\nSay my name and "help" and I will tell you what I can do.`);
    embed.setColor(7054789);
    message.channel.send({embeds: [embed]});
   }); 
}