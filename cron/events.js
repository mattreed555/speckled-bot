const cron = require("node-cron");
const events = require("./../core/events.js");


module.exports = controller => {
  cron.schedule("*/45 * * * * *", events.handleEvents);
};
