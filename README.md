# bandcamp + discord rich presence


![image](https://user-images.githubusercontent.com/44883301/181871960-c4de7d71-adac-49ec-9fde-24376479bda3.png)
![image](https://user-images.githubusercontent.com/44883301/181871927-9d15dd0a-f3eb-495f-b73b-1332398f19fb.png)


nodeJS integration of bandcamp and Discord RPC, very similar to how Spotify integrates with Discord.\
fork of  [kiawildberger/bandcamp-discord](https://github.com/kiawildberger/bandcamp-discord) 

## features

🎵 detects album title, artwork, artist, and song's title;\
⏰ shows song's elapsed time;\
⚙️ detects and updates your Rich Presence automatically;\
🌐 works on collections, album and track pages;\
💙 if you had supported the artist, it will show a heart just near the artwork  <3

![image](https://user-images.githubusercontent.com/44883301/181872010-7e3b6eba-4129-4ee5-9853-02c4ee672b22.png)

## configuration

in `config.json`  there is these configurations:

- `receive_port` : default: 8000, http://localhost port to receive data. this needs to be the same as the `send_port` in the `userscript.js`
- `show_elapsed` : default: true, shows elapsed time;
- `show_heart` : default: true, shows heart 💙 if detected that you own the track/album you're currently playing.

## installation & setup

1. install [NodeJS](https://nodejs.org/en/) if you don't have it already;
2. download code;
3. open terminal;
4. install forever using: `npm install forever`;
5. open terminal in the code folder;
6. install Express using: `npm install express`;
7. install CORS using: `npm install cors`;
8. install discord-rpc using: `npm install discord-rpc`;

after that:

1. in your browser, install the file `userscript.js` to a userscript manager. recommended: Tampermonkey ([chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo;), [firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey), [opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/))
2. tweak the `config.json` if you want **(optional)**
3. before running the `run.bat`, you want to head over to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application (or use an existing one);
4. then in the **OAuth2** section, copy/save your client id;
5. now paste this into the `main.js` and edit the 2nd line `clientId = "XXX"`, replacing XXX with your application id;
6. save the edits you've made and then follow the steps below according to your platform;
7. (Windows) run `run.bat` to start the main script;
3. (Linux) run `forever main.js` in the code folder;

given the message: **"Bandcamp Rich Presence - Hooked!"** that means its ready and the window can be closed.\
play some songs in Bandcamp and it should be working :)

### restart/stop

1. open terminal;
2. run command `forever stopall` or `forever main.js stop`;
3. open task manager and look for an task exactly called `node.exe` or `node`, then kill the task;

the script has been stopped. start again using:

4. (Windows) run `run.bat` to start the main script;
4. (Linux) run `forever main.js` in the code folder.

## known issues:
- it relies on a http://localhost POST signal to trade data between the `userscript` and the `main` script. it may not work if your internet is not configured to receive or can't receive those signals;
- sometimes it can take up to 10 seconds to update or flick between the current and last song you were playing; (this is a discord-rpc issue)
- may crash whenever Discord closes or restarts (see 'restart/stop' section on how to restart the script)
- may not show Rich Presence if the title of the song is too long or use too many or unsupported unicode characters
