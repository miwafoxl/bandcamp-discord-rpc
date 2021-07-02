// ==UserScript==
// @name Bandcamp collection QoL
// @namespace tpanda
// @version 0.1
// @description add basic keyboard control and changes the tab name to current song
// @include https://bandcamp.com/*
// @run-at document-idle
// @author kiawildberger
// ==/UserScript==

(function() {
    if(!document.title.includes("'s collection")) return;
    let artist, album, song, state = "pause", data, playing = false, cachesong, cachedata, host = 'http://localhost'; // i can change host to ip of rpi if i want ig
    setInterval(() => {
        song = document.querySelector(`span[data-bind="text: currentTrack().trackTitle"]`).innerText
        album = document.querySelector(`div[data-bind="text: currentTrack().title"]`).innerText
        artist = document.querySelector(`span[data-bind="text: currentTrack().artist"]`).innerText
        document.title = song+" by "+artist+" | Bandcamp"
        if(!cachesong && song) {
            playing = true
            cachesong = song;
        } else { playing = false }

        data = {
            album: album,
            artist: artist,
            song: song,
            state: (!playing) ? "pause" : "play"
        }
        sendToDiscord()
    }, 1000);

    window.addEventListener("keypress", e => {
        if(e.code === "Space" && document.activeElement.tagName != "TEXTAREA") {
            document.querySelector(".playpause").click()
            e.preventDefault()
        }
    })
    document.querySelector(".playpause").addEventListener("click", () => {
        // let play = document.querySelector("div.play"), pause = document.querySelector("div.pause")
        // if(play.style.display == "none") {
        //     state = "paused"
        // } else if(pause.style.display == "none") {
        //     state = "playing"
        // }
        playing = !playing;
        sendToDiscord()
    })
    // setInterval(() => sendToDiscord, 10000)

    function sendToDiscord() {
        fetch(host+":6969", {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(data)
        }).then(response => {
            if(response.code === "Yeah") console.log("successfully updated discord status")
        })
    }
    window.addEventListener("beforeunload", () => {
        fetch(host+":6969", {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ state: "stop" })
        })
        console.error("stop")
    })
})();