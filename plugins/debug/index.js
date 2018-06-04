'use strict';
var debug = require('debug')('PsyBot');

const PAD_SIZE = 25;

module.exports = {
    enabled: true,
    prefix: '!debug servers',
    callback: (bot, message) => {
        let reply = '```';

        reply += `${'Server Name'.padEnd(PAD_SIZE)} | ${'Owner'.padEnd(PAD_SIZE)} | Member count\n`;

        bot.client.guilds.forEach(async (guild) => {
            reply += `${guild.name.padEnd(PAD_SIZE)} | ${guild.owner.user.tag.padEnd(PAD_SIZE)} | ${guild.memberCount}\n`;
        });

        reply += '```';        
        return bot.privateMsg(message, reply);
    }
}