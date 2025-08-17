const Discord = require("discord.js");
const reaction = require('./../core/reaction.js');    
const passphraseDb = require('../db/passphrase-db.js');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function parseResponse(response) {
  return response.data.choices[0].text.trim();
}

const func = async (message) => {

    let sender = message.author.toString();

    let question = message.content.substr(message.content.toLowerCase().indexOf("what")).trim();
    
    let prompt = `Q: What will I draw? \nA: art\n\nQ: What should I draw about Halloween?\nA: art\n\nQ: What should I sketch?\nA: art\n\nQ: What painting should I do?  I could paint a dog.\nA: art\n\nQ: What should I write?\nA: write\n\nQ: What kind of pie should I bake?\nA: cook\n\nQ: What kind of food should I make?\nA: cook\n\nQ: What can you tell me about the password?\nA: password\n\nQ: What do you think of the password?\nA: password\n\nQ: ${question}\nA:`;

    message.react('👍');
    
    
  // let response = await openai.createCompletion({
  //   model: "gpt-3.5-turbo-instruct",
  //   //model: "babbage:ft-black-market-design-2023-04-08-01-25-43",
  //   prompt: prompt,
  //   temperature: 0,
  //   max_tokens: 1,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  // });

  // let answer = parseResponse(response);
  // let command = answer.split(" ")[0];

   
    let newPrompt = question;
    let newModel = "gpt-3.5-turbo-instruct";
    let intro = "\n";
    
 //  switch (command) {
 //    case 'password':
 //      let currentPassword = passphraseDb.getPassPhrase();
 //      newPrompt = "Write a funny short paragraph that includes the exact phrase '" + currentPassword +"'";
 //      break;
 //    case 'art':
 //      intro = "Here are some ideas:\n";
 //      newPrompt = question + ". Brainstorm 3 numbered ideas.";
 //     // newModel = "text-curie-001";
 //      break;
 //    case 'cook':
 //      intro = "Here are some ideas:\n";
 //      newPrompt = question + ". Brainstorm 3 numbered ideas.";
 //    //  newModel = "text-curie-001";
 //      break;
 //    case 'write':
 //      intro = "Here are some ideas:\n";
 //      newPrompt = question + ". Brainstorm 3 numbered ideas.";
 //   //   newModel = "text-curie-001";
 //      break;
 //  }
    
    response = await openai.createCompletion({
      model: newModel,
      prompt: newPrompt,
      temperature: 0.8,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
    
     
    message.reply( intro + parseResponse(response)); 
    
    
   };

module.exports = (controller)=> {
  controller.hears("what", "I answer your question about prompts and passwords", func); 
  controller.hears("what's", "I answer your question about prompts and passwords", func); 
}