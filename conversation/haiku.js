const Discord = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const mentions = require('./../core/mentions.js');
const words = require('./../core/words.js');
const topics = words.readWordsText("haiku").split("\n");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


module.exports = (controller) => {
  controller.hears("haiku", "I'll write a haiku.", async (message) => {
    
    
      const targets = mentions.getMessageTargets(message).reverse().join(", ");

    
       const topic = topics[Math.floor(Math.random() * topics.length)];
    

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Write a haiku about a ${topic}`,
        temperature: 0.8,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
    
    message.channel.send('So ' + targets + ' here is your haiku about ' + topic + ':\n' + response.data.choices[0].text.trim());
    
       
   }); 
}