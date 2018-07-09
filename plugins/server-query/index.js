'use strict';
var debug = require('debug')('PsyBot');
const Gamedig = require('gamedig');

module.exports = {
    enabled: true,
    prefix: '!query',
    args: true,
    callback: (bot, message, args) => {
        _type, _host = args.split(' ', 1);
        Gamedig.query({
            type: _type,
            host: _host
        }).then((state) => {
            bot.reply(message, JSON.stringify(state));
        }).catch((error) => {
            bot.reply(message, "Server is offline / An error occurred");
        });
    }
}