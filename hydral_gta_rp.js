const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./auth.json");

const database = require("./components/database");

/*Clock in / out information for police and EMS*/
const register = require("./components/clockin-clockout/register");
const clockIn = require("./components/clockin-clockout/clock-in");
const clockOut = require("./components/clockin-clockout/clock-out");
const weekly = require("./components/clockin-clockout/weekly");
const total = require("./components/clockin-clockout/total");

/*
  Dm Users that have not clocked out specifically.
*/
const dmPolice = require("./components/clockin-clockout/dm-police-not-clocked");

//Police report information
const viewReports = require("./components/police-db/view-reports");
const addReports = require("./components/police-db/add-reports");

//Police bolo information
const reports = require("./components/police-reports/reports");
const active = require("./components/police-reports/show-active-reports");
const remove = require("./components/police-reports/remove-active-reports");

const serverId = "591107228665249805";

const channelPoliceReportChannelId = "591649299151192101";
const channelPoliceTimeLogChannelId = "591649098659004416";

//const channelSheriffReportChannelId = "591650202969047040";
const channelSheriffTimeLogChannelId = "591649098659004416";

const channelAmbulanceTimeLogChannelId = "591650284778815518";

const channelMechanicTimeLogChannelId = "600524154080591872";

let CronJob = require("cron").CronJob;
new CronJob(
  "0 0 */3 * * *",
  function() {
    //first number is discord channel ID, 2nd is discord server ID
    active.showReports(
      null,
      database,
      null,
      channelPoliceReportChannelId,
      serverId,
      client
    );
    console.log("You will see this message every 6 hours");
  },
  null,
  true,
  "America/Chicago"
);

// new CronJob(
//   "0 0 */3 * * *",
//   function() {
//     //first number is discord channel ID, 2nd is discord server ID
//     active.showReports(null, database, null, serverId, channelPoliceReportChannelId, client);
//     console.log("You will see this message every 6 hours");
//   },
//   null,
//   true,
//   "America/Chicago"
// );

new CronJob(
  "0 59 23 * * FRI",
  function() {
    const sql = "UPDATE gta_rp SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 59 23 * * FRI",
  function() {
    const sql = "UPDATE gta_ems SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 59 23 * * FRI",
  function() {
    const sql = "UPDATE gta_mechanic SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 59 23 * * FRI",
  function() {
    const sql = "UPDATE gta_sheriff SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 0 */1 * * *",
  async () => {
    const sql = " SELECT * FROM gta_police WHERE clock_in > clock_out";

    const results = await database.query(sql);

    dmPolice.dmPolice(results, serverId, channelPoliceTimeLogChannelId, client);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 0 */1 * * *",
  async () => {
    const sql = " SELECT * FROM gta_sheriff WHERE clock_in > clock_out";

    const results = await database.query(sql);

    dmPolice.dmPolice(
      results,
      serverId,
      channelSheriffTimeLogChannelId,
      client
    );
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 0 */1 * * *",
  async () => {
    const sql = " SELECT * FROM gta_ems WHERE clock_in > clock_out";

    const results = await database.query(sql);

    dmPolice.dmPolice(
      results,
      serverId,
      channelAmbulanceTimeLogChannelId,
      client
    );
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 0 */1 * * *",
  async () => {
    const sql = " SELECT * FROM gta_mechanic WHERE clock_in > clock_out";

    const results = await database.query(sql);

    dmPolice.dmPolice(
      results,
      serverId,
      channelMechanicTimeLogChannelId,
      client
    );
  },
  null,
  true,
  "America/Chicago"
);

client.login(config.token);

client.on("message", async message => {
  let table;

  if (message.content.startsWith("!register")) {
    if (message.channel.id === channelPoliceTimeLogChannelId) {
      table = "gta_police";
      register.register(message, database, table);
    } else if (message.channel.id === channelSheriffTimeLogChannelId) {
      table = "gta_sheriff";
      register.register(message, database, table);
    } else if (message.channel.id === channelAmbulanceTimeLogChannelId) {
      table = "gta_ems";
      register.register(message, database, table);
    } else {
      table = "gta_mechanic";
      register.register(message, database, table);
    }
  }

  if (message.content.startsWith("!clockin")) {
    if (message.channel.id === channelPoliceTimeLogChannelId) {
      table = "gta_police";
      clockIn.clockIn(message, database, table);
    } else if (message.channel.id === channelSheriffTimeLogChannelId) {
      table = "gta_sheriff";
      clockIn.clockIn(message, database, table);
    } else if (message.channel.id === channelAmbulanceTimeLogChannelId) {
      table = "gta_ems";
      clockIn.clockIn(message, database, table);
    } else {
      table = "gta_mechanic";
      clockIn.clockIn(message, database, table);
    }
  }

  if (message.content.startsWith("!clockout")) {
    if (message.channel.id === channelPoliceTimeLogChannelId) {
      table = "gta_police";
      clockOut.clockOut(message, database, table);
    } else if (message.channel.id === channelSheriffTimeLogChannelId) {
      table = "gta_sheriff";
      clockOut.clockOut(message, database, table);
    } else if (message.channel.id === channelAmbulanceTimeLogChannelId) {
      table = "gta_ems";
      clockOut.clockOut(message, database, table);
    } else {
      table = "gta_mechanic";
      clockOut.clockOut(message, database, table);
    }
  }

  if (message.content.startsWith("!weekly")) {
    if (message.channel.id === channelPoliceTimeLogChannelId) {
      table = "gta_police";
      weekly.weekly(message, database, table);
    } else if (message.channel.id === channelSheriffTimeLogChannelId) {
      table = "gta_sheriff";
      weekly.weekly(message, database, table);
    } else if (message.channel.id === channelAmbulanceTimeLogChannelId) {
      table = "gta_ems";
      weekly.weekly(message, database, table);
    } else {
      table = "gta_mechanic";
      weekly.weekly(message, database, table);
    }
  }

  if (message.content.startsWith("!total")) {
    if (message.channel.id === channelPoliceTimeLogChannelId) {
      table = "gta_police";
      total.total(message, database, table);
    } else if (message.channel.id === channelSheriffTimeLogChannelId) {
      table = "gta_sheriff";
      total.total(message, database, table);
    } else if (message.channel.id === channelAmbulanceTimeLogChannelId) {
      table = "gta_ems";
      total.total(message, database, table);
    } else {
      table = "gta_mechanic";
      total.total(message, database, table);
    }
  }

  if (message.content.startsWith("!bolo")) {
    reports.reports(message, database, Discord);
  }

  if (message.content.startsWith("!active")) {
    active.showReports(
      message,
      database,
      null,
      channelPoliceReportChannelId,
      serverId,
      client
    );
  }

  if (message.content.startsWith("!remove")) {
    remove.removeReports(message, database, Discord);
  }

  if (message.content.startsWith("!report")) {
    addReports.addReports(message, database, Discord);
  }

  if (message.content.startsWith("!view")) {
    viewReports.viewReports(message, database, Discord);
  }
});
