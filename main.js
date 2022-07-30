const discord = require("discord-rpc");
const clientId = "1002380451090010202";
const rpc = new discord.Client({transport:'ipc'});
const config = require("./config.json")
var port = config.receive_port
var express = require('express');
var cors = require('cors');
var app = express();
let elapsed = -1;
var keyCache

app.use(express.json());
app.use(
    cors({
        origin: "*",
        allowedHeaders: ['Origin', 'Content-Type']
    }))
app.listen(port, () => console.log("Bandcamp Rich Presence - Hooked!\nConfigured to port "+port+"\nYou can safely close this window"))
app.post('/', (request, response) => {
    setActivity(request.body)
    response.send({code: "Yeah"})
});

setInterval(() => {
    if(elapsed < 6 && elapsed >= 0) { elapsed++ } else {elapsed = -1; rpc.clearActivity();}
}, 1000);

function setActivity(data) {
    elapsed = 0
    if(data.state == "pause") {
        rpc.clearActivity()
        return;
    }
    if(data.key == keyCache) return;
    rpc.clearActivity();
    keyCache = data.key
    // console.log(keyCache)
    rpc.setActivity({
        name: data.song,
        instance: true,
        details: ((data.song).length = 1 ? data.song+" " : data.song),
        state: data.artist,
        largeImageKey: data.artwork,
        largeImageText: data.album,
        startTimestamp: config.show_elapsed == true ? data.timestamp : null,
        smallImageKey: config.show_heart && data.owned == true ? "heart" : "bandcamp",
        smallImageText: config.show_heart && data.owned == true ? "💙 supported "+data.artist+" on bandcamp 💙" : "listening on bandcamp"
    });
};

rpc.login({clientId}).catch(console.error)
