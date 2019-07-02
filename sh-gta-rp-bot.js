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

//Police report information
const reports = require("./components/police-reports/reports");
const active = require("./components/police-reports/show-active-reports");
const remove = require("./components/police-reports/remove-active-reports");

var CronJob = require("cron").CronJob;
new CronJob(
  "0 0 */3 * * *",
// "*/30 * * * * *",

  function() {
    //first number is discord channel ID, 2nd is discord server ID
    active.showReports(null, database, null, "573969751433412629", "566472673849507841", client);
    console.log("You will see this message every 6 hours");
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 59 23 * * FRI",
  function() {
    let sql = "UPDATE gta_rp SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

new CronJob(
  "0 59 23 * * FRI",
  function() {
    let sql = "UPDATE gta_ems SET weekly_hours = 0";
    database.query(sql);
  },
  null,
  true,
  "America/Chicago"
);

client.login(config.token);

client.on("message", async message => {
  let table;

  if (
    (message.content.startsWith("!register") &&
      message.channel.id === "579428028455714816") ||
    (message.content.startsWith("!register") &&
      message.channel.id === "571551283262128148")
  ) {
    if (message.channel.id === "579428028455714816") {
      table = "gta_rp";
    } else {
      table = "gta_ems";
    }
    register.register(message, database, table);
  }

  if (
    (message.content.startsWith("!clockin") &&
      message.channel.id === "579428028455714816") ||
    (message.content.startsWith("!clockin") &&
      message.channel.id === "571551283262128148")
  ) {
    if (message.channel.id === "579428028455714816") {
      table = "gta_rp";
    } else {
      table = "gta_ems";
    }
    clockIn.clockIn(message, database, table);
  }

  if (
    (message.content.startsWith("!clockout") &&
      message.channel.id === "579428028455714816") ||
    (message.content.startsWith("!clockout") &&
      message.channel.id === "571551283262128148")
  ) {
    if (message.channel.id === "579428028455714816") {
      table = "gta_rp";
    } else {
      table = "gta_ems";
    }
    clockOut.clockOut(message, database, table);
  }

  if (
    (message.content.startsWith("!weekly") &&
      message.channel.id === "579428028455714816") ||
    (message.content.startsWith("!weekly") &&
      message.channel.id === "571551283262128148")
  ) {
    if (message.channel.id === "579428028455714816") {
      table = "gta_rp";
    } else {
      table = "gta_ems";
    }
    weekly.weekly(message, database, table);
  }

  if (
    (message.content.startsWith("!total") &&
      message.channel.id === "579428028455714816") ||
    (message.content.startsWith("!total") &&
      message.channel.id === "571551283262128148")
  ) {
    if (message.channel.id === "579428028455714816") {
      table = "gta_rp";
    } else {
      table = "gta_ems";
    }
    total.total(message, database, table);
  }

  if (message.content.startsWith("!bolo")) {
    reports.reports(message, database, Discord);
  }

  if (message.content.startsWith("!active")) {
    active.showReports(message, database, null, "573969751433412629", "566472673849507841", client);
  }

  if (message.content.startsWith("!remove")) {
    remove.removeReports(message, database, Discord);
  }

});
