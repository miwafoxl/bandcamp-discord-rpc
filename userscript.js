// ==UserScript==
// @name Bandcamp Rich Presence for Discord
// @namespace tpanda
// @version 1a
// @description integrates bandcamp to discord rich presence
// @match https://bandcamp.com/*
// @match https://*.bandcamp.com/album/*
// @match https://*.bandcamp.com/track/*
// @run-at document-idle
// @author miwafoxl, kiawildberger
// ==/UserScript==

const send_port = '8000'

function calculateTimestamp(time) { // this should work fine if the song is not 24 hours long
    let timestamp, timestampRaw
    if (time == "collection") {
        timestampRaw = (document.querySelector(`span[data-bind="text: positionStr"]`).innerText).split(":")
    } else {
        timestampRaw = (document.querySelector(`span[class="time_elapsed"]`).innerText).split(":") }
    timestampRaw.reverse()
    timestamp = (Number(timestampRaw[0]) + (Number(timestampRaw[1])*60))*1000
    if(timestampRaw[2] !== undefined) {timestamp = timestamp+(((timestampRaw[2]*60)*60)*1000)}
    console.log("now: "+(Date.now())+"\nplayback array: "+timestampRaw+"\nplayback time: "+timestamp+"\ntimestamp: "+(Date.now()-timestamp)) // debugging
    return (Date.now() - timestamp);
}

(function() {
    var player
    if(document.title.includes("'s collection")) player = "collection";
    if(document.URL.includes("/album/")) player = "album";
    if(document.URL.includes("/track/")) player = "track";
    console.log("DOCUMENT TYPE: "+player);
    //return;
    let state = "pause", data, playing = false; // i can change host to ip of rpi if i want ig
    let artist, album, song, status = "pause", artworkURL, timestamp, owned = false
    let artist2, album2, song2, status2 = "pause", key, busy, pause // cache variables to check difference

    setInterval(() => {
        switch(player) {
            case "collection":
                owned = false
                if (window.getComputedStyle(document.querySelector(`span[class="purchased-msg collection-btn"]`)).display !== "none") owned = true
                song2 = document.querySelector(`span[data-bind="text: currentTrack().trackTitle"]`).innerText // song
                if (song2 === undefined) return; // prevent showing "undefined" in the rich presence
                album2 = document.querySelector(`div[data-bind="text: currentTrack().title"]`).innerText // album
                artist2 = document.querySelector(`span[data-bind="text: currentTrack().artist"]`).innerText // artist
                artworkURL = document.querySelector(`img[data-bind="attr: { 'src': currentTrack().artURL }"`).attributes.src.value
                busy = document.querySelector("div.busy").style.display == "none" ? false : true
                pause = document.querySelector("div.pause").style.display == "none" ? false : true
                break
            case "album":
                if (document.querySelector(`h3[class="you-own-this digital"]`) === null) {owned = false} else {
                owned = (window.getComputedStyle(document.querySelector(`h3[class="you-own-this digital"]`)).display !== "none") ? true : false }
                song2 = document.querySelector(`span[class="title"]`).innerText
                artist2 = (document.querySelector(`div[id="name-section"]`).innerText).split("by ").pop()
                album2 = document.querySelector(`h2[class="trackTitle"]`).innerText
                artworkURL = document.querySelector(`a[class="popupImage"]`).href
                busy = document.querySelector(`div[class="playbutton busy"]`) === null ? false : true
                pause = document.querySelector(`div[class="playbutton playing"]`) === null ? false : true
                break
            case "track":
                if (document.querySelector(`h3[class="you-own-this digital"]`) === null) {owned = false} else {
                owned = (window.getComputedStyle(document.querySelector(`h3[class="you-own-this digital"]`)).display !== "none") ? true : false }
                song2 = document.querySelector(`h2[class="trackTitle"]`).innerText
                artist2 = (document.querySelector(`h3[class="albumTitle"]`).innerText).split("by ").pop()
                album2 = (document.querySelector(`h3[class="albumTitle"]`).innerText).split("by ")[0].slice(5,-1)
                artworkURL = document.querySelector(`a[class="popupImage"]`).href
                busy = document.querySelector(`div[class="playbutton busy"]`) === null ? false : true
                pause = document.querySelector(`div[class="playbutton playing"]`) === null ? false : true
                break
        }

        if (busy == false){
            status2 = pause == true ? "play" : "pause" }

        if (status == "pause" && status2 == "pause") return; // prevents clashing with other open bandcamp tabs

        if (song != song2 || album != album || artist != artist2 || status != status2){ // check if something has updated
            status = status2
            song = song2
            album = album2
            artist = artist2
            timestamp = calculateTimestamp(player)
            key = Math.random().toString(36).slice(2, 7);
            console.log("player: "+player+"timestamp: "+timestamp+"\nstatus: "+status+"\nowned: "+owned+"\ntitle: "+song+"\nalbum: "+album+"\nartist: "+artist) // debugging

            data = {
                album: album,
                artist: artist,
                song: song,
                artwork: artworkURL,
                timestamp: timestamp,
                state: status,
                owned: owned,
                key: key
        }}
        updateActivity()
    }, 1000);
    setInterval(() => {
        if (status == "pause" && status2 == "pause") return;
        data.timestamp = calculateTimestamp(player) // updates timestamp
    }, 7000)
    function updateActivity() {
        fetch("http://localhost:"+send_port, {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(data)
        }).then(response => {
            if(response.code === "Yeah") console.log("successfully updated")
        })
    }
//    window.addEventListener("beforeunload", () => {
//        fetch(host+":8000", {
//            method: "POST",
//            mode: "cors",
//            headers: { 'Content-Type': "json" },
//            body: JSON.stringify({ state: "stop" })
//        })
//        console.error("stop")
//    })
})();
