module.exports = {
    removeReports: async (message, database, Discord) => {
        const id = message.content.split(' ').splice(1).toString().replace(/,/g, ' ');

        const sql = 'DELETE FROM police_reports WHERE id = ?';
        database.query(sql,id);

        message.channel.send("ID " + id + " is now deleted.");
    }
}