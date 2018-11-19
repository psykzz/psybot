'use strict';
const debug = require('debug')('PsyBot');
const SourceQuery = require('sourcequery');
const async = require('async');

const sq = new SourceQuery(5000); // 5000ms timeout

const WATCH_INTERVAL = 3000;
let watchId;
let messageId;

module.exports = {
    enabled: true,
    prefix: '!watch',
    args: true,
    callback: (bot, message, host) => {
        
        if (watchId) {
            clearTimeout(watchId);
        }

        let ip, port;
        [ip, port] = host.split(':', 2);

        // Placeholder message
        bot.reply(message,  'Working...', -1)
        .then(msg => {
            messageId = msg;
            watchId = setInterval(() => {
                sq.open(ip, port);
                async.parallel([
                    (cb) => sq.getInfo(cb),
                    (cb) => sq.getPlayers(cb),
                    (cb) => sq.getRules(cb)
                ], (err, results) => {
                    sq.close(() => {});
                    if (err) {
                        return;
                    }
                    let reply = "```";
                    reply += `\nName: ${results[0].name}\n`
                    reply += `Map: ${results[0].map}\n`
                    reply += `Players: ${results[0].players}/${results[0].maxplayers}\n`
                    results[1].forEach(player => {
                        reply += `\t${player.name} - ${Math.round(player.online / 60 / 60)} hour(s)\n`;
                    });
                    reply += "```"
                    messageId.edit(reply);
                })
            }, WATCH_INTERVAL);
        });

        
    }
}
