const discordrpc = require("discord-rpc")
const clientId = "860389782664118273"
const rpc = new discordrpc.Client({transport:'ipc'})
const express = require('express'), app = express();

let elapsed = 0;
setInterval(() => {
    if(elapsed < 10) { elapsed++ } else {rpc.clearActivity();}
}, 1000);

app.use(express.json())
app.post('/', (request, response) => {
    elapsed = 0
    setActivity(request.body)
    response.send(JSON.stringify({code: "Yeah"}))
})

app.listen(6969);
console.log("express server ready")

let artist, song, album;
function setActivity(data) {
    if(data.state === "stop" || elapsed > 10) {
        rpc.clearActivity()
        return;
    }
    rpc.setActivity({
        instance: true,
        details: `${data.artist} - ${data.song}`,
        state: "on "+data.album,
        largeImageKey: "bc-logo",
        largeImageText: "deez nuts lol",
        // smallImageKey: data.state,
        // smallImageText: (data.state === "play") ? "playing" : "paused"
        // smallImageText: data.state
    })
}

rpc.login({clientId}).catch(console.error)