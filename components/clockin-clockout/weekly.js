module.exports = {
    weekly: async (message, database, table) => {
        const sql = "SELECT * from "+ table +" WHERE weekly_hours IS NOT NULL";
        const results = await database.query(sql);
        let array = []
        try {
            for (let player of results) {
                let data = " " + "<@" + player.discord_uid + ">" + " " + player.weekly_hours + "\n"
                array.push(data)
            }
            message.channel.send({
                "embed":{
                    "description":array.toString().replace(/[,]/g,"")
                }
            })
        }catch(err){
            console.log(err)
        }
    }
};