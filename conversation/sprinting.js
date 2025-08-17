const sprint = require("./../core/sprint.js");

const getArgsText = (message, cmd) => {
    const offset = message.content.indexOf(cmd) + cmd.length;
    return message.content.substring(offset).trim();
}

module.exports = (controller)=> {
  controller.hears("sprint", "sprint", m => sprint.startSprint(m, getArgsText(m, "sprint"))); 
  controller.hears("cancel", "cancel", m => sprint.cancelsprint(m, getArgsText(m, "cancel")));  
  controller.hears("time", "time", m => sprint.sprinttime(m, getArgsText(m, "time"))); 
  controller.hears("join", "join", m => sprint.joinsprint(m, getArgsText(m, "join"))); 
  controller.hears("report", "report", m => sprint.reportsprint(m, getArgsText(m, "report"))); 
  controller.default(sprint.defaultAction);
}


