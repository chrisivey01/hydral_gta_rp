module.exports = {
    clockOut: async (message, database, table) => {
        const discord_uid = message.author.id;
        const sql = "SELECT * FROM "+ table +" WHERE discord_uid = ?";

        let results;
        try {
            results = await database.query(sql, discord_uid)
        } catch (err) {
            return message.channel.send("You're not in the database, please !register first.")
        }
        beginClockOut(message, database, discord_uid, results, table)
    }
};

beginClockOut = async (message, database, discord_uid, results, table) => {

    const currentTime = new Date();
    const currentTimeFormatted = currentTime.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric"});
    const clockInTimeFormatted = results[0].clock_in.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric"
    });

    const timeInMs = currentTime - results[0].clock_in;
    const resultsTime = destructMS(timeInMs);

    let weekly_hours;
    let total_hours;
    weekly_hours = resultsTime.h + results[0].weekly_hours;
    total_hours = resultsTime.h + results[0].total_hours;

    message.channel.send("You've clocked out at " + currentTimeFormatted + " server time. A total of " + resultsTime.h + " hours and " + resultsTime.m + " minutes. " +
        "You've logged " + weekly_hours + " hours this week and " + total_hours + " hours total.");

    const sql = "UPDATE "+ table +" SET clock_in = ?, clock_out = ?, total_hours = ?, weekly_hours = ? WHERE discord_uid = ?";
    const data = [currentTime, currentTime, total_hours, weekly_hours, discord_uid];

    try {
        database.query(sql, data)
    } catch (err) {
        message.channel.send(err + "Please contact Chris")
    }
};

destructMS = (milli) => {
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
    return {d: d, h: h, m: m, s: s, ms: ms};
};