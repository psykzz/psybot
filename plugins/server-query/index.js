'use strict';
const debug = require('debug')('PsyBot');
const SourceQuery = require('sourcequery');
const async = require('async');

const sq = new SourceQuery(5000); // 1000ms timeout

module.exports = {
    enabled: true,
    prefix: '!query',
    args: true,
    callback: (bot, message, host) => {
        let ip, port;
        [ip, port] = host.split(':', 2);

        sq.open(ip, port);

        async.parallel([
            (cb) => sq.getInfo(cb),
            (cb) => sq.getPlayers(cb),
            (cb) => sq.getRules(cb)
        ], (err, results) => {
            sq.close(() => {});
            if (err) {
                return bot.reply(message, `Request failed: ${err}`, -1);
            }
            let reply = "```";
            reply += `\nName: ${results[0].name}\n`
            reply += `Map: ${results[0].map}\n`
            reply += `Players: ${results[0].players}/${results[0].maxplayers}\n`
            results[1].forEach(player => {
                reply += `\t${player.name} - ${Math.round(player.online / 60 / 60)} hour(s)\n`;
            });
            reply += "```"
            bot.reply(message, reply, -1);
        })
    }
}
