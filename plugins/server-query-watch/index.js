'use strict';
const debug = require('debug')('PsyBot');
const SourceQuery = require('sourcequery');
const async = require('async');

const sq = new SourceQuery(5000); // 5000ms timeout

const WATCH_INTERVAL = 3000;
let progressCounter = 0;
let messageId;

function GetInfo(ip, port, msg, counter) {
    if (!progressCounter !== counter) {
        return;
    }
    sq.open(ip, port);
    async.parallel([
        (cb) => sq.getInfo(cb),
        (cb) => sq.getPlayers(cb),
        (cb) => sq.getRules(cb)
    ], (err, results) => {
        // Close connection
        sq.close(() => {
            if (err) {
                setTimeout(() => GetInfo(ip, port, msg, counter), WATCH_INTERVAL)
            }
            let reply = "```";
            reply += `\nName: ${results[0].name}\n`
            reply += `Map: ${results[0].map}\n`
            reply += `Players: ${results[0].players}/${results[0].maxplayers}\n`
            results[1].forEach(player => {
                reply += `\t${player.name} - ${Math.round(player.online / 60 / 60)} hour(s)\n`;
            });
            reply += "```"
            msg.edit(reply);
            setTimeout(() => GetInfo(ip, port, msg, counter), WATCH_INTERVAL)
        });
    });
}



module.exports = {
    enabled: true,
    prefix: '!watch',
    args: true,
    callback: (bot, message, host) => {
        progressCounter += 1;

        let ip, port;
        [ip, port] = host.split(':', 2);

        // Placeholder message
        bot.reply(message,  'Working...', -1)
        .then(msg => {
            WatchServerInfo(ip, port, msg, progressCounter);
        });
    }
}
