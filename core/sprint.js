const nopt = require("nopt");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require("fs");
const sprintDb = require("./../db/sprint-db.js");
const discInfo = require("./../core/disc-info.js");
const template = require("./../core/message-template.js");

const calculateTimes = function(whenToCalc, whenIsNow) {
  const timeRemaining = whenToCalc.getTime() - whenIsNow.getTime();

  const min = Math.floor(timeRemaining / (1000 * 60));
  const sec = Math.floor((timeRemaining - min * (1000 * 60)) / 1000);

  return {
    minremaining: `${min} minutes`,
    secremaining: `${sec} seconds`
  };
};

const getUserIds = sprintInfo => {
  let results = [];

  for (const memberName in sprintInfo.members) {
    if (
      sprintInfo.members.hasOwnProperty(memberName) &&
      sprintInfo.members[memberName].joined
    ) {
      results.push(memberName);
    }
  }

  return results;
};

const getUserGoals = sprintInfo => {
  let results = [];

  for (const memberName in sprintInfo.members) {
    if (
      sprintInfo.members.hasOwnProperty(memberName) &&
      sprintInfo.members[memberName].joined
    ) {
      results.push(sprintInfo.members[memberName].goal);
    }
  }

  return results;
};

const getUserReports = sprintInfo => {
  let results = [];

  for (const memberName in sprintInfo.members) {
    if (
      sprintInfo.members.hasOwnProperty(memberName) &&
      sprintInfo.members[memberName].joined
    ) {
      results.push(sprintInfo.members[memberName].accomplished);
    }
  }

  return results;
};

const getSprintMessageIfSprinting = async function(message, value) {
  const context = getContext(message);
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );
  if (sprintInfo.sprintActive === false) {
    return "";
  } else {
    return await getSprintMessage(value, sprintInfo, context.whenIsNow, context.guild);
  }
};

const getSprintMessage = async function(value, sprintInfo, whenIsNow, guild) {
  const result = calculateTimes(sprintInfo.scheduledEndTime, whenIsNow);

  const userIds = getUserIds(sprintInfo);

  const users = await discInfo.getUsersRefsByIds(userIds);

  const participants = users.join(", ");

  const output = await template.getMessage(
    value,
    result.minremaining,
    result.secremaining,
    participants,
    null,
    guild
  );

  return output;
};

const saveSprintData = async (context, sprintInfo) => {
  await sprintDb.saveSprintDataByGuildAndChannel(
    context.guild,
    context.channel,
    sprintInfo
  );
};

const deleteSprintData = async context => {
  await sprintDb.deleteSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );
};

const getContext = message => {
  return {
    guild: message.guild.id,
    channel: message.channel.id,
    user: message.author.id,
    whenIsNow: new Date()
  };
};

const knownOpts = { for: [Number], in: [Number] };

const activate = async (context, lengthInMin, offsetInMin) => {
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  if (sprintInfo.sprintActive === false) {
    let newSprintInfo = {
      sprintActive: true,
      activatedBy: context.user,
      activatedAt: context.whenIsNow,
      members: {},
      scheduledStartTime: new Date(
        context.whenIsNow.getTime() + 60000 * offsetInMin
      ),
      scheduledEndTime: new Date(
        context.whenIsNow.getTime() + 60000 * (lengthInMin + offsetInMin)
      ),
      scheduledCloseTime: new Date(
        context.whenIsNow.getTime() + 60000 * (lengthInMin + offsetInMin + 5)
      )
    };
    newSprintInfo.members[context.user] = {
      joined: true,
      goal: "",
      accomplished: ""
    };
    await saveSprintData(context, newSprintInfo);

    return {
      result: true,
      message: `**A new sprint has been scheduled**\nSprint will start in approx ${offsetInMin} minutes and will run for ${lengthInMin} minute(s), so get your head in the game! What do you plan to work on?`
    };
  } else {
    return {
      result: false,
      message: "The sprint has already started so I can't start a new one."
    };
  }
};

const startSprint = async message => {
  const v = message.content
    .replace("print", "prent") // this is a hack
    .replace("for", "--for")
    .replace("in", "--in")
    .split(" ");
  const parsed = nopt(knownOpts, {}, v, 2);
  const howLong = parsed.for || 25;
  const whenToStart = parsed.in || 1;
  const response = await activate(getContext(message), howLong, whenToStart);

  message.channel.send(response.message);
};

const cancel = async context => {
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  if (sprintInfo.sprintActive === false) {
    return {
      result: false,
      message: "There is no active sprint."
    };
  } else {
    await deleteSprintData(context);

    return {
      result: true,
      message: `Sprint cancelled. This makes me sad, but I understand and I am sure you have a good reason. I believe in you.`
    };
  }
};

const cancelsprint = async message => {
  const response = await cancel(getContext(message));
  message.channel.send(response.message);
};

const hype = async message => {
  const context = getContext(message);
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  const response = await getSprintMessage(
    "hype",
    sprintInfo,
    context.whenIsNow,
    context.guild
  );

  message.channel.send(response);
};

const join = async (context, goal) => {
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  if (sprintInfo.sprintActive === false) {
    return {
      result: false,
      message: "There is no active sprint."
    };
  } else {
    if (sprintInfo.members == null) {
      sprintInfo.members = {};
    }
    sprintInfo.members[context.user] = {
      joined: true,
      goal: goal,
      accomplished: ""
    };
    await saveSprintData(context, sprintInfo);
    return {
      result: true,
      message: ""
    };
  }
};

const joinsprint = async (message, argsText) => {
  const response = await join(getContext(message), argsText);

  if (response.message.length > 0) {
    message.channel.send(response.message);
  }

  if (response.result) {
    message.react("788423214959034379");
  }
};

const report = async (sprintInfo, context, accomplishment) => {
  if (sprintInfo.sprintActive === false) {
    return {
      result: false,
      message: "There is no active sprint.",
      sprintDone: false
    };
  } else {
    if (sprintInfo.members == null) {
      sprintInfo.members = {};
    }
    if (!sprintInfo.members.hasOwnProperty(context.user)) {
      return {
        result: false,
        message:
          "You weren't part of the sprint.  Don't forget to join next time.",
        sprintDone: false
      };
    } else {
      sprintInfo.members[context.user].accomplished = accomplishment;
      await saveSprintData(context, sprintInfo);

      const isDone =
        getUserReports(sprintInfo).find(element => element.length === 0) ==
        undefined;

      return {
        result: true,
        message: "", // no message when you report
        sprintDone: isDone
      };
    }
  }
};

const reportsprint = async (message, argsText) => {
  const context = getContext(message);

  console.log('hi');
  
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  const response = await report(sprintInfo, context, argsText);

  if (response.message.legnth > 0) {
    message.channel.send(response.message);
  }

  if (response.result) {
    message.react("788239339846762527");
  }

  if (response.sprintDone) {
    message.channel.send(
      await closeSprint(context.guild, context.channel, sprintInfo)
    );
  }
};

const getTime = async context => {
  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  if (sprintInfo.sprintActive === false) {
    return {
      result: false,
      message: "There is no active sprint."
    };
  } else {
    if (sprintInfo.sprintStartTime == null) {
      const result = calculateTimes(
        sprintInfo.scheduledStartTime,
        context.whenIsNow
      );

      return {
        result: true,
        message: `There are ${result.minremaining}, ${result.secremaining} until the sprint starts.`
      };
    } else {
      return {
        result: true,
        message: await getSprintMessage("time", sprintInfo, context.whenIsNow,context.guild)
      };
    }
  }
};

const sprinttime = async message => {
  const response = await getTime(getContext(message));
  message.channel.send(response.message);
};

const getStartingMessage = async (userIds, userGoals) => {
  let message = "**Sprint Started!**\nOur amazing sprinters:\n";

  const users = await discInfo.getUsersRefsByIds(userIds);

  let i;
  for (i = 0; i < users.length; i++) {
    const report = userGoals[i];
    let planMessage;
    if (report.length > 0) {
      planMessage = ` plans to "${report}"`;
    } else {
      planMessage = " will do something amazing.";
    }
    message =
      message + (i + 1).toString() + ". " + users[i] + planMessage + "\n";
  }
  
  return message;
};

const getClosingMessage = async (userIds, userReports) => {
  let message =
    ":sparkler: **Sprint Results** :fireworks:\n" +
    "Congratulations! Well done, everyone!\n";

  const users = await discInfo.getUsersRefsByIds(userIds);

  let i;
  for (i = 0; i < users.length; i++) {
    const report = userReports[i];
    let reportMessage;
    if (report.length > 0) {
      reportMessage = ` reported "${report}"`;
    } else {
      reportMessage = " didn't report, but that's ok.";
    }
    message =
      message + (i + 1).toString() + ". " + users[i] + reportMessage + "\n";
  }
  return message;
};

const closeSprint = async (guild, channel, sprintInfo) => {
  const userIds = getUserIds(sprintInfo);

  const userReports = getUserReports(sprintInfo);

  const closingMessage = await getClosingMessage(userIds, userReports);

  await sprintDb.deleteSprintDataByGuildAndChannel(guild, channel);

  return closingMessage;
};

const startSprintText = async (guild, channel, sprintInfo) => {
  const userIds = getUserIds(sprintInfo);

  const userGoals = getUserGoals(sprintInfo);

  const startingMessage = await getStartingMessage(userIds, userGoals);

  return startingMessage;
};

const checkSprints = async whenIsNow => {
 
    
  
  const results = await sprintDb.getAllSprintData();
  

  let messages = [];

  for (const element of results) {
    const sprintInfo = element.obj;

    if (sprintInfo != null && sprintInfo.sprintActive == true) {
      if (
        sprintInfo.sprintStartTime == null &&
        sprintInfo.scheduledStartTime.getTime() < whenIsNow.getTime()
      ) {
        sprintInfo.sprintStartTime = whenIsNow;

        await sprintDb.saveSprintDataByGuildAndChannel(
          element.guild,
          element.channel,
          sprintInfo
        );

        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: await startSprintText(
            element.guild,
            element.channel,
            sprintInfo
          )
        });

        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: await getSprintMessage("start", sprintInfo, whenIsNow, element.guild)
        });

      } else if (
        sprintInfo.sprintEndTime == null &&
        sprintInfo.scheduledEndTime.getTime() < whenIsNow.getTime()
      ) {
        sprintInfo.sprintEndTime = whenIsNow;

        await sprintDb.saveSprintDataByGuildAndChannel(
          element.guild,
          element.channel,
          sprintInfo
        );

        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: "**Time is up!**"
        });

        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: await getSprintMessage("end", sprintInfo, whenIsNow, element.guild)
        });

        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: "The sprint will close in 5 minutes. What did you accomplish?"
        });
      } else if (
        sprintInfo.sprintEndTime != null &&
        sprintInfo.scheduledCloseTime != null &&
        sprintInfo.scheduledCloseTime.getTime() < whenIsNow.getTime()
      ) {
        messages.push({
          guild: element.guild,
          channel: element.channel,
          message: await closeSprint(element.guild, element.channel, sprintInfo)
        });
      }
    }
  }

  return messages;
};

const checkSprint = async () => {
  const response = await checkSprints(new Date());

  
  for (const record of response) {
    await client.guilds
      .fetch(record.guild)
      .then(guild =>
        client.channels
          .fetch(record.channel)
          .then(channel => channel.send(record.message))
      )
      .catch(console.error);
  }
};

const defaultAction = async (message) => {
  const context = getContext(message);

  const sprintInfo = await sprintDb.getSprintDataByGuildAndChannel(
    context.guild,
    context.channel
  );

  const offset = message.content.indexOf(">") + 1;
  const msg = message.content.substring(offset).trim();

  if (message.length == 0) return;
  
  if (sprintInfo.sprintEndTime != null &&
      sprintInfo.scheduledCloseTime != null) {
    
    reportsprint(message, msg);
    
  }
  else if (sprintInfo.sprintActive === false) {
    const maybeNum = msg.split(" ")[0];
    if (!isNaN(maybeNum)) {
      message.content = message.content.replace(maybeNum + " in", "sprint for " + maybeNum + " in");
      startSprint(message, "for " + msg);
    }
  return;
  }
  else if(sprintInfo.sprintStartTime == null) {

    joinsprint(message, msg);
    
  }
  
};


module.exports = {
  checkSprint: checkSprint,
  startSprint: startSprint,
  cancelsprint: cancelsprint,
  sprinttime: sprinttime,
  joinsprint: joinsprint,
  reportsprint: reportsprint,
  hype: hype,
  getSprintMessageIfSprinting: getSprintMessageIfSprinting,
  defaultAction: defaultAction
};
