const Sequelize = require("sequelize");
let SprintModel;

// setup a new database
// using database credentials set in .env
const sequelize = new Sequelize(
  "database",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    storage: ".data/database.sqlite"
  }
);

(async function() {
await sequelize
  .authenticate()
  .then(function(err) {
    SprintModel = sequelize.define("sprints", {
      key: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      object: {
        type: Sequelize.STRING
      }
    });
    SprintModel.sync();
  })
  .catch(err => {
    console.log("Unable to connect to the database: ", err);
  });
}());

const parseObject = obj => {
  const dates = [
    "activatedAt",
    "scheduledStartTime",
    "scheduledEndTime",
    "scheduledCloseTime"
  ];
  const parsedObject = JSON.parse(obj);

  if (parsedObject === null) {
    return null;
  }

  for (const element of dates) {
    if (element != null && parsedObject.hasOwnProperty(element)) {
      parsedObject[element] = new Date(parsedObject[element]);
    }
  }

  return parsedObject;
};

const serializeObject = obj => {
  const objectString = JSON.stringify(obj);
  return objectString;
};

const getSprintDataByGuildAndChannel = async (guild, channel) => {
  const keyString = guild + "|" + channel;
  const findSprint = await SprintModel.findByPk(keyString);
  let myData;
  let sprintActive;
  if (findSprint === null) {
    return {
      sprintActive: false
    };
  } else {
    return parseObject(findSprint.object);
  }
};

const saveSprintDataByGuildAndChannel = async (guild, channel, sprintInfo) => {
  const keyString = guild + "|" + channel;
  const objectString = serializeObject(sprintInfo);

  await SprintModel.upsert({ key: keyString, object: objectString });
};

const deleteSprintDataByGuildAndChannel = async (guild, channel) => {
  const keyString = guild + "|" + channel;

  await SprintModel.destroy({ where: { key: keyString } });
};

const getAllSprintData = async () => {
  const allSprints = await SprintModel.findAll();
  return allSprints.map(x => {
    const splitter = x.key.split("|");
    return {
      guild: splitter[0],
      channel: splitter[1],
      key: x.key,
      obj: parseObject(x.object)
    };
  });
};

module.exports = {
  getSprintDataByGuildAndChannel: getSprintDataByGuildAndChannel,
  saveSprintDataByGuildAndChannel: saveSprintDataByGuildAndChannel,
  deleteSprintDataByGuildAndChannel: deleteSprintDataByGuildAndChannel,
  getAllSprintData: getAllSprintData
};
