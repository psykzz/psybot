'use strict';
var debug = require('debug')('PsyBot');

module.exports = {
    enabled: true,
    prefix: "!prune",
    requiredPermissions: ['MANAGE_MESSAGES'],
    args: /^ (\d+)?.*$/,
    callback: async (bot, message, limit) => {
        if (!bot.hasPerm(message, 'MANAGE_MESSAGES')) {
            return bot.reply(message, 'I don\'t have the required permissions to prune messages.');
        }

        debug("Regex matching", limit);
        const delLimit = limit[1] || 10;

        var usersToPrune = message.mentions.users;

        await message.delete(); // delete the original prune message
        const messages = await message.channel.fetchMessages({limit: delLimit});
        debug(`Searching through ${message.size}`);

        const original = bot.reply(message, 'Deleting messages now...', 0);

        // Delete all the matching messages
        messages.forEach(msg => {
            if(usersToPrune.exists('username', msg.author.username)) {
                msg.delete();
            }
        });
        await original.delete();
    }
}