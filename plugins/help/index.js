'use strict';

module.exports = {
    enabled: true,
    prefix: "!help",
    callback: (bot, message) => {
      var reply = "```";

      bot.commands.forEach(cmd => {
        if (!cmd.prefix) return;
        reply += `  ${cmd.prefix.padEnd(15)} - ${cmd.help || 'No help text'}\n`;
      });

      reply += "```";

      bot.reply(message, reply, 30000);
    }
}