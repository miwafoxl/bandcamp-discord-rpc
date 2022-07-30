# Bandcamp + Discord Rich Presence


![image](https://user-images.githubusercontent.com/44883301/181871960-c4de7d71-adac-49ec-9fde-24376479bda3.png)
![image](https://user-images.githubusercontent.com/44883301/181871927-9d15dd0a-f3eb-495f-b73b-1332398f19fb.png)


NodeJS Integration of Bandcamp and Discord RPC, very similar to how Spotify integrates with Discord.
Fork of  [kiawildberger/bandcamp-discord](https://github.com/kiawildberger/bandcamp-discord) 

## Features:!

🎵 Detects album title, artwork, artist, and song's title;
⏰ Shows song's elapsed time;
⚙️ Detects and updates your Rich Presence automatically;
🌐 Works on collections, album and track pages;
💙 If you supported the artist, it will show a heart just near the artwork  <3

![image](https://user-images.githubusercontent.com/44883301/181872010-7e3b6eba-4129-4ee5-9853-02c4ee672b22.png)

## Configurations:

In `config.json`  there is these configurations:

- `receive_port` : Default: 8000, http://localhost port to receive data. This needs to be the same as the `send_port` in the `userscript.js`
- `show_elapsed` : Default: true, shows elapsed time;
- `show_heart` : Default: true, shows heart 💙 if detected that you own the track/album you're currently playing;

## Installation & Setup:

1. Install [NodeJS](https://nodejs.org/en/) if you don't have it already;
2. Download code;
3. Open terminal
4. Install forever using: `npm install forever`
5. Open terminal in the code folder;
6. Install Express using: `npm install express`
7. Install CORS using: `npm install cors`
8. Install discord-rpc using: `npm install discord-rpc`

After that:

1. In your browser, install the file `userscript.js` to a UserScript manager. Recommended: Tampermonkey (Download for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo;), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey), [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/))
2. Tweak the `config.json` if you want **(optional)**
3. (Windows) Run `run.bat` to start the main script;
3. (Linux) Run `forever main.js` in the code folder;

if this message is shown in the terminal: **"Bandcamp Rich Presence - Hooked!"** that means its ready and the window can be closed.
Play some songs in Bandcamp and it should be working :)

### Restart/Stop

1. Open terminal;
2. Run command `forever stopall` or `forever main.js stop`;
3. Open task manager and look for an task exactly called `node.exe` or `node`, then kill the task;

The script has been stopped. Start again using:

4. (Windows) Run `run.bat` to start the main script;
4. (Linux) Run `forever main.js` in the code folder.

## Know issues:
- It relies on a http://localhost POST signal to trade data between the `userscript` and the `main` script. It may not work if your internet is not configured to receive or can't receive those signals;
- Sometimes it can take up to 10 seconds to update or flick between the current and last song you were playing; (this is a discord-rpc issue)
- May crash whenever Discord closes or restarts (see 'Restart/Stop' section on how to restart the script)

