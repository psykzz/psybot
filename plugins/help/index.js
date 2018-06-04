'use strict';

module.exports = {
    enabled: true,
    prefix: "!help",
    callback: (bot, message) => {
      var reply = "```";

      bot.commands.forEach(cmd => {
        reply += `  ${cmd.prefix} - ${cmd.help}
        `;
      });

      reply += "```";

      bot.reply(message, reply, 30000);
    }
}