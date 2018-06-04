'use strict';
var Discord = require('discord.js');
var debug = require('debug')('PsyBot');


var FSConfig = require('./lib/fs-config');

class PsyBot {
  constructor(token, options) {
    this.commands = [];

    this.token = token;

    this.config = new FSConfig();

    this.options = options || {};

    // Discord specific settings
    this.options.discord = this.options.discord || {};
    this.options.discord.disableEveryone = this.options.discord.disableEveryone || true;

    this.createClient(this.options.discord);

    this.setupHandlers();
    this.login(token);
  }

  setupHandlers() {
    if (!this.options.disableMessageLogging) {
      this.client.on('message', (message) => {
        if (message.guild && message.channel) {
          debug(`(- ${message.guild.name} / #${message.channel.name}) ${message.author.username}: ${message.content}`);
        } else {
          debug(`(Private) ${message.author.username}: ${message.content}`);
        }
      });
    }

    this.client.on('message', (message) => {
      if (message.author.bot) {
        return;
      }

      this.commands.forEach((cmd) => {
        if (message.channel.isPrivate === true && cmd.allowPrivate === false) {
          return;
        }

        this.parseCommand(message, cmd);
      });

    });
    
    // Update server playing list
    this.client.on("guildCreate", guild => {
      console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
      this.client.user.setGame(`on ${client.guilds.size} Servers`);
    });

    this.client.on("guildDelete", guild => {
      console.log(`Remove from: ${guild.name} (id: ${guild.id})`);
      this.client.user.setGame(`on ${this.client.guilds.size} Servers`);
    });
  }

  reply(message, text, timeout) {
    timeout = timeout || 5000;
    message.reply(text)
    .then(msg => {
      if (timeout > 0) {
        msg.delete(timeout);
        message.delete(timeout);
      }
    });
  }

  async privateMsg(message, text) {
    await message.author.send(text);
    await message.react('👍');
    const canDelete = await this.hasPerm(message, 'MANAGE_MESSAGES');
    if (canDelete) {
      await message.delete();
    }
  }

  hasPerm(message, perm_flag) {
    return message.guild.me.hasPermission(perm_flag);
  }

  parseCommand(message, cmd) {
    var msg = message.content.trim();

    // Must start with the prefix
    // Must be only the prefix if args on
    // Must not be only the prefix with args off
    // TODOOO REWORK THIS BIT
    const hasPrefix = (msg.indexOf(cmd.prefix) === 0);
    const hasArgsAndExtraText = (cmd.args === true) && (msg !== cmd.prefix);
    const noArgsAndExactMatch = (cmd.args === false) && (msg === cmd.prefix);
    debug('match', !hasPrefix || !hasArgsAndExtraText || !noArgsAndExactMatch, hasPrefix, hasArgsAndExtraText, noArgsAndExactMatch)
    if (!hasPrefix) {
      debug('msg.indexOf(cmd.prefix)', msg.indexOf(cmd.prefix), msg, cmd.prefix);
      return;
    } 
    if (!hasArgsAndExtraText) {
      return;
    } 
    if (!noArgsAndExactMatch) {
      debug('cmd.args === false) && (msg === cmd.prefix', cmd.args, msg, cmd.prefix);
      return;
    }

    // Check permission
    if(cmd.requiredPermissions) {
      if (!message.member.hasPermission(cmd.requiredPermissions)) {
        return this.reply(message, `You don't have the '${cmd.requiredPermissions.toString()}' permissions`);
      }
    }
    else if(cmd.requiredRole) { // Check role based permissions
      var role = message.member.roles.exists('name', cmd.requiredRole);
      if(!role) {
        return this.reply(message, `You don't have the '${cmd.requiredRole}' role.`);
      }
    }
    message.channel.startTyping();

    var restOfMessage = null;
    if (cmd.args) {
      if (cmd.args !== true) {
        // We need to match the regex
        restOfMessage = msg.substr(cmd.prefix.length).match(cmd.args);
        if (restOfMessage === null) {
          debug("Comand arguements didn't match.");
        }
      } else {
        // return it all, we don't care
        restOfMessage = msg.substr(cmd.prefix.length).trim();
      }
    }

    var response = cmd.callback(this, message, restOfMessage);
    message.channel.stopTyping();
    return response;
  }

  addCommands(commands) {
    var self = this;
    commands.forEach(cmd => self.addCommand(self, cmd));
  }

  addCommand(self, cmd) {
    if (cmd.prefix === undefined || cmd.callback === undefined) {
      debug('Invalid Command, the following does not have a command and callback defined', cmd);
      return;
    }

    if (!cmd.enabled) {
      debug('Command disabled, skipping', cmd.prefix);
      return;
    }

    self.commands.push(cmd);
    debug('Command added', cmd.prefix);
  }

  createClient(options) {
    this.client = new Discord.Client(options);
    return this.client;
  }

  login(token) {
    this.client.login(token).then(() => {
      debug('Successfully logged in');

      this.client.user.setActivity(`on ${this.client.guilds.size} Servers`);
      this.client.user.setUsername('HeiHei')
      .then(user => debug(`Updated username: ${user.username}`))
      .catch(debug);
    })
    .catch(error => debug('There was an error logging in: ' + error));
  }
}

module.exports = PsyBot;
