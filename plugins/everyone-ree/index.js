'use strict';
var debug = require('debug')('PsyBot');

module.exports = {
    enabled: true,
    callback: async (bot, message, limit) => {
        if(message.mentions.everyone != true) return;

        let ree = bot.client.emojis.find("name", "pingree");
        let ree2 = bot.client.emojis.find("name", "angreeping");

        if(!ree) ree = '💩';
        
        message.react(ree);
    }
}