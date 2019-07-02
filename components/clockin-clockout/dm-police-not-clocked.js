module.exports = {

    dmPolice: async (results, channel, server, client) => {

        for (let jackass of results) {
            client.guilds
                .get(server)
                .channels.get(channel).send("<@" + jackass.discord_uid + "> clock out if you aren't logged in.");
        }
    }
}