const cron = require("node-cron");
const sprint = require("./../core/sprint.js");


module.exports = controller => {
  cron.schedule("*/20 * * * * *", sprint.checkSprint);
};
