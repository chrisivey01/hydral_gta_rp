module.exports = {
    clockIn: async (message, database, table) => {
        const discord_uid = message.author.id;
        const sql = "SELECT * FROM "+ table +" WHERE discord_uid = ?";

        await database.query(sql, discord_uid, (err) => {
            if (err) {
                return message.channel.send("You're not in the database, please !register first.")
            }
            beginClockIn(message, database, discord_uid, table)
        });
    }
};

beginClockIn = async (message, database, discord_uid, table) => {

    const currentTime = new Date();
    const currentTimeFormatted = currentTime.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric"});

    message.channel.send("You've clocked in at " + currentTimeFormatted + " server time.");

    const startClock = [
        currentTime,
        discord_uid
    ];

    const sql = "UPDATE "+ table +" SET clock_in = ? WHERE discord_uid = ?";
    await database.query(sql, startClock)
};