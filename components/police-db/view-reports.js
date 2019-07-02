module.exports = {

    viewReports: async (message, database, Discord) => {
        // const name = message.content.split(" ")[1];        
        message.channel.send("Input citizen's name: ");
        let name;

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            name = message.content;
            collector.stop();

            message.channel.send("Did you mean to type? " + name + " Type yes or no.");
            const dataCollector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
            dataCollector.on('collect', async (message) => {
                if (message.content.toLowerCase() === "yes") {
                    dataCollector.stop()

                    /*
                        Begin querying data, sort by and get newest 10
                    */
                    try {
                        const sql = "SELECT * FROM pd_cad WHERE player_name = ? ORDER BY time_stamp DESC LIMIT 0, 10";
                        const results = await database.query(sql, name);

                        let newArray = [];
                        results.map(arrest => {
                            newArray.push("Arresting Officer: " + arrest.arresting_officer + ". Reason: " + arrest.reason + " On " + new Date(arrest.time_stamp).toDateString() + " \n")
                        })

                        message.channel.send(
                            {
                                "embed": {
                                    "title": "All arrests on " + results[0].player_name,
                                    "description": newArray.toString().replace(/,/g, "")
                                }
                            });
                    } catch{
                        message.channel.send("This user is not in the Police database.")
                    }
                } else {
                    message.channel.send("Aborting...")
                    dataCollector.stop()
                    return;
                }
            })
        })
    }
}