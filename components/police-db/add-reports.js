module.exports = {

    addReports: (message, database, Discord) => {
        const sql = "INSERT INTO pd_cad SET player_name = ?, reason = ?, arresting_officer = ?";
        let name;
        let reason;
        let arrestingOfficer;
        message.channel.send("Please type in the citizen's name.")
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            name = message.content;
            collector.stop();

            message.channel.send("Did you mean to type? " + name + " Type yes or no.");
            const dataCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
            dataCollector.on('collect', message => {
                if (message.content.toLowerCase() === "yes") {
                    message.channel.send("Insert reason:")
                    dataCollector.stop();
                    const reasonCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
                    reasonCollector.on('collect', message => {
                        reason = message.content;
                        message.channel.send("ID:" + name + "\n" + "Reason: " + reason + "\n" + "Arresting officer: " + "<@" +  message.author.id + ">");
                        arrestingOfficer = message.author.username;
                        reasonCollector.stop();
                        const data = [name, reason, arrestingOfficer] 
                        database.query(sql, data)
                    })
                } else {
                    message.channel.send("Aborting...")
                    return;
                }
            })
        })

    }
}