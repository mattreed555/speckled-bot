const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });

const getUsersRefsByIds = async (userIds) => {
  let result = [];
  for (let userId of userIds) {
    const user = await client.users.fetch(userId);
    result.push(user.toString());
  }  
  return result;
}

module.exports = {
 getUsersRefsByIds: getUsersRefsByIds
};