module.exports = {
  showReports: async (message, database, Discord, channel, server, client) => {
    const sql = "SELECT * FROM police_reports WHERE active = 1";
    const results = await database.query(sql);
    
    const poepoeRole = client.guilds.get(server).roles.find(x => x.name === "Police").id

    if (channel) {
      if (results.length > 0) {
        client.guilds
        .get(server)
        .channels.get(channel).send("<@&" + poepoeRole +">" + " active BOLOs on -------");
        for (let bolo of results) {
          const currentTime = new Date();
          const msHours = currentTime.getTime() - bolo.time_stmp.getTime();
          const time = destructMS(msHours);
          client.guilds
            .get(server)
            .channels.get(channel)
            .send({
              embed: {
                description:
                  "Record # " +
                  bolo.id +
                  ". Reason: " +
                  bolo.reason +
                  " ----  Active " +
                  time.h +
                  " hours " +
                  time.m +
                  " minutes " +
                  time.s +
                  " seconds."
              }
            });
        }
        client.guilds
          .get(server)
          .channels.get(channel)
          .send("If your BOLO is resolved do !remove INPUT RECORD NUMBER");
      } else {
        client.guilds
          .get(server)
          .channels.get(channel)
          .send("No active BOLO at this time.");
      }
    } else {
      if (results.length > 0) {
        client.guilds
        .get(server)
        .channels.get(channel).send("<@&" + poepoeRole +">" + " active BOLOs on -------");
        for (let bolo of results) {
          const currentTime = new Date();
          const msHours = currentTime.getTime() - bolo.time_stmp.getTime();
          const time = destructMS(msHours);
          message.channel.send({
            embed: {
              description:
                "Record # " +
                bolo.id +
                ". Reason: " +
                bolo.reason +
                " ----  Active " +
                time.h +
                " hours " +
                time.m +
                " minutes " +
                time.s +
                " seconds."
            }
          });
        }

        message.channel.send(
          "If your BOLO is resolved do !remove INPUT RECORD NUMBER"
        );
      } else {
        message.channel.send("No active BOLO at this time.");
      }
    }
  },

  destructMS: milli => {
    if (isNaN(milli) || milli < 0) {
      return null;
    }

    let d, h, m, s, ms;
    s = Math.floor(milli / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    ms = Math.floor((milli % 1000) * 1000) / 1000;
    return { d: d, h: h, m: m, s: s, ms: ms };
  }
};
