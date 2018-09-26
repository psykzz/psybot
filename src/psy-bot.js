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
    
    // Generic error handler
    this.client.on('error', error => debug(`An error occurred: ${error}`, {error}));
    
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
      this.client.user.setActivity(`on ${this.client.guilds.size} Servers`);
    });

    this.client.on("guildDelete", guild => {
      console.log(`Remove from: ${guild.name} (id: ${guild.id})`);
      this.client.user.setActivity(`on ${this.client.guilds.size} Servers`);
    });
  }

  reply(message, text, timeout) {
    timeout = timeout || 5000;
    return message.reply(text)
    .then(msg => {
      if (timeout < 1) {
        return msg;
      }
      message.delete(timeout);
      return msg.delete(timeout);
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
    const hasPrefix = (msg.indexOf(cmd.prefix) === 0);
    const hasArgsAndNoExtraText = (cmd.args) && (msg === cmd.prefix);
    const noArgsAndNotExactMatch = (!cmd.args) && (msg !== cmd.prefix);
    if (cmd.prefix && (!hasPrefix || hasArgsAndNoExtraText || noArgsAndNotExactMatch)) {
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

    cmd.prefix = cmd.prefix || '';

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

    var response;
    try {
      message.channel.startTyping();
      response = cmd.callback(this, message, restOfMessage);
    } catch (e) {
      debug('Error running callback', e)
      return;
    } finally {
      message.channel.stopTyping(true);
    }
    
    return response;
  }

  addCommands(commands) {
    var self = this;
    commands.forEach(cmd => self.addCommand(cmd));
  }

  addCommand(cmd) {
    if (cmd.callback === undefined) {
      debug('Invalid Command, the following does not have a command and callback defined', cmd);
      return;
    }

    if (!cmd.enabled) {
      debug('Command disabled, skipping', cmd.prefix);
      return;
    }

    this.commands.push(cmd);
    debug('Command added', cmd.prefix);
  }

  addEventHandlers(config) {
    Object.keys(config).forEach(event => {
      config[event].forEach(handler => {
        this.client.on(event, (oldPresence, newPresence) => {
          try {
            handler.callback(this, oldPresence, newPresence)
          } catch (e) {
            debug(`Failed to handle event: ${event}\nException: ${e}`);
          }
        });
      })
    })
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
