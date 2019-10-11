'use strict';
var debug = require('debug')('PsyBot');
var slug = require('slug');

module.exports = {
    enabled: true,
    onEvent: (bot, eventType, args) => {
        if (eventType !== 'presenceUpdate') { return; }
        const [ oldPresence, newPresence ] = args;
        const timestamp = (new Date()).toISOString();

        // Only if tracking an old game.
        if (oldPresence && oldPresence.presence && oldPresence.presence.game) {
            const oldGame = slug(oldPresence.presence.game.name);
            const oldUser = slug(oldPresence.displayName);
            let stops = bot.config.get(`${oldUser}.game.${oldGame}.stop`) || [];
            stops.push(timestamp);
            bot.config.set(`${oldUser}.game.${oldGame}.stop`, stops);
        }

        // Only if tracking a new game.
        if (newPresence && newPresence.presence && newPresence.presence.game) {
            const newGame = slug(newPresence.presence.game.name);
            const newUser = slug(newPresence.displayName);

            let starts = bot.config.get(`${newUser}.game.${newGame}.start`) || [];
            starts.push(timestamp);
            bot.config.set(`${newUser}.game.${newGame}.start`, starts);
        }
    }
}