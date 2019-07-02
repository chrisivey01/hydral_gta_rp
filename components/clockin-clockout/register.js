module.exports = {

    register: (message, database, table) => {

        // const user_id = message.member.user.tag;
        const discord_uid = message.author.id;
        const dataObj = {
            discord_uid: discord_uid
        };

        let sql = "INSERT INTO "+ table +" SET ? ON DUPLICATE KEY UPDATE discord_uid = VALUES(discord_uid)";
        database.query(sql, dataObj, (err) => {
            if (err) {
                message.channel.send(err.sqlMessage)
            } else {
                message.channel.send("<@" + dataObj.discord_uid + "> is now registered. Type !clockin and !clockout to keep up with your timesheet.")
            }
        });
    }
};