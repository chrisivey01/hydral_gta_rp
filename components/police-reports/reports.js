module.exports = {
    reports: async (message, database, Discord) => {
        let bolo = message.content.split(' ').splice(1).toString().replace(/,/g, ' ');

        message.channel.send("BOLO inserted...")

        const sql = "INSERT INTO police_reports SET active = ?, reason = ?";
        const data = [1, bolo];
        await database.query(sql,data);

        const idBoloSql = "SELECT id FROM police_reports WHERE reason = ?";
        const obtainId = [bolo];
        const results = await database.query(idBoloSql, obtainId);

        message.channel.send(bolo + " Which the ID in the LSPD DB is: " + results[0].id);
    }
};