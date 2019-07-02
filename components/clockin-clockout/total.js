module.exports = {
    total: async (message, database, table) => {
        const sql = "SELECT * from "+ table +" WHERE total_hours IS NOT NULL";
        const results = await database.query(sql);
        let array = []
        try {
            for (let player of results) {
                let data = " " + "<@" + player.discord_uid + ">" + " " + player.weekly_hours + "\n"
                array.push(data)
            }
            message.channel.send({
                "embed":{
                    "description":array.toString().replaceAll(",","")
                }
            })
        }catch(err){
            console.log(err)
        }
    }
};