'use strict';
var debug = require('debug')('PsyBot');
var slug = require('slug');
var async = require('async');


// TODO: This all needs work.

module.exports.help = {
    enabled: true,
    prefix: '!psybot group help',
    callback: (bot, message) => {
      message.reply(`**GROUP HELP**

        **Admin shit**

        - \`!group ban <group>\` - bans a specific group
        - \`!group unban <group>\` - unbans a specific group

        **User shit**

        - \`!groups\` - Shows all availble groups
        - \`!group join <group>\` - Joins a group
        - \`!group leave <group>\` - Joins a group

        Shout at **Midge** if its broken`);
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot group unban',
    args: true,
    requiredPermissions: ['MANAGE_ROLES_OR_PERMISSIONS'],
    callback: (bot, message, group) => {
      group = slug(group);
      var allowedRoles = bot.config.get('allowedRoles', []);

      var availableRoles = message.guild.roles.filter(item => {
        debug('availableRole', item.name, (allowedRoles.indexOf(item.name) !== -1));
        return (allowedRoles.indexOf(item.name) === -1);
      }).map(item => {
        return item.name;
      });

      if (availableRoles.indexOf(group) === -1) {
        bot.reply(message, 'group is not valid or already unbanned');
        return;
      }

      allowedRoles.push(group);
      bot.config.set('allowedRoles', allowedRoles);
      bot.reply(message, `you have unbanned the group ${group}`);
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot group ban',
    args: true,
    requiredPermissions: ['MANAGE_ROLES_OR_PERMISSIONS'],
    callback: (bot, message, group) => {
      group = slug(group);
      var allowedRoles = bot.config.get('allowedRoles', []);

      var index = allowedRoles.indexOf(group);
      if (index === -1) {
        message.reply('that group is not available.');
        return;
      }

      allowedRoles.splice(index, 1);
      bot.config.set('allowedRoles', allowedRoles);
      message.reply(`you have banned the group ${group}`);
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot groups',
    callback: (bot, message) => {
      var allowedRoles = bot.config.get('allowedRoles', []);

      var availableRoles = message.guild.roles.filter(item => {
        return (allowedRoles.indexOf(slug(item.name)) !== -1);
      }).map(item => {
        return slug(item.name);
      });

      if (!availableRoles.length) {
        bot.reply(message, 'none of the groups have been allowed yet.');
        return;
      }

      bot.reply(message, `you can join the following groups with !psybot group join <group> \n` + availableRoles.join(', '));
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot group join',
    args: true,
    callback: (bot, message, group) => {
      var allowedRoles = bot.config.get('allowedRoles', []);
      group = slug(group);
      var role;

      var availableRoles = message.guild.roles.filter(function(item) {
          if(slug(item.name).toLowerCase() === group.toLowerCase()) {
              role = item;
          }
          return (allowedRoles.indexOf(item.name) !== -1);
      }).map(function(item) {
          return item.name;
      });

      if (!availableRoles.length) {
        bot.reply(message, 'none of the groups have been allowed yet.');
        return;
      }

      if(availableRoles.indexOf(role.name) === -1 || !role) {
        bot.reply(message, 'that group is not whitelisted or isn\'t available.');
        return;
      }

      message.member.addRole(role).then(() => {
          bot.reply(message, `you\'ve been granted the \`${role.name}\` role`);
      }).catch(e => {
          debug(e);
      });
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot group leave',
    args: true,
    callback: (bot, message, group) => {
      var allowedRoles = bot.config.get('allowedRoles', []);
      group = slug(group);
      var role;

      var availableRoles = message.guild.roles.filter(function(item) {
          if(slug(item.name).toLowerCase() === group.toLowerCase()) {
              role = item;
          }
          return (allowedRoles.indexOf(item.name) !== -1);
      }).map(function(item) {
          return item.name;
      });

      if (!availableRoles.length) {
        bot.reply(message, 'none of the groups have been allowed yet.');
        return;
      }

      if(availableRoles.indexOf(role.name) === -1 || !role) {
        bot.reply(message, 'that group is not whitelisted or isn\'t available.');
        return;
      }

      // A user can "attempt" to remove a role they don't have and the bot will report its working.
      message.member.removeRole(role).then(() => {
          bot.reply(message, `the \`${role.name}\` role has been removed.`);
      }).catch(e => {
          debug(e);
      });
    },
};

module.exports.something = {
    enabled: false,
    prefix: '!psybot group create',
    args: true,
    requiredPermissions: ['MANAGE_ROLES_OR_PERMISSIONS'],
    callback: (bot, message, group) => {
      var allowedRoles = bot.config.get('allowedRoles', []);
      var groupSlug = slug(group);

      if (!message.guild) {
        return;
      }

      async.waterfall([
        (callback) => {
          var roleExists = message.guild.roles.exists('name', groupSlug);
          if (roleExists) {
            return callback(null, message.guild.roles.find('name', groupSlug));
          }
          message.guild.createRole({name: groupSlug, mentionable: false})
          .then((role) => {
            callback(null, role);
          }).catch(debug);
        },
        (newRole, callback) => {
          message.member.addRole(newRole);
          debug(`Adding ${message.author.name} to ${newRole.name}`);
          callback(null, newRole);
        },
        (newRole, callback) => {
          var textChan;
          var textChanExists = message.guild.channels.some(channel => {
            var exists = channel.name === groupSlug && channel.type === 'text';
            if (exists) {
              textChan = channel;
            }
            return exists;
          });

          if (textChanExists) {
            return callback(null, newRole, textChan);
          }

          message.guild.createChannel(groupSlug, 'text')
          .then(chan => {
            debug("Created text channel", chan.name);
            callback(null, newRole, chan);
          })
          .catch(callback);
        },
        (newRole, textChan, callback) => {
          var voiceChan;
          var voiceChanExists = message.guild.channels.some(channel => {
            var exists = channel.name === groupSlug && channel.type === 'voice';
            if (exists) {
              voiceChan = channel;
            }
            return exists;
          });

          if (voiceChanExists) {
            return callback(null, newRole, textChan, voiceChan);
          }

          message.guild.createChannel(groupSlug, 'voice')
          .then(chan => {
            debug("Created voice channel", chan.name);
            callback(null, newRole, textChan, chan);
          })
          .catch(callback);
        },
        (newRole, textChan, voiceChan, callback) => {
          textChan.overwritePermissions(newRole, {
              READ_MESSAGES: true,
              SEND_MESSAGES: true,
          })
          .then(() => callback(null, newRole, textChan, voiceChan))
          .catch(callback);
        },
        (newRole, textChan, voiceChan, callback) => {
          voiceChan.overwritePermissions(newRole, {
            CONNECT: true,
            SPEAK: true,
          })
          .then(() => callback(null, newRole, textChan, voiceChan))
          .catch(callback);
        },
        (newRole, textChan, voiceChan, callback) => {
          var everyoneRole = message.guild.roles.find('name', '@everyone');
          textChan.overwritePermissions(everyoneRole, {
              READ_MESSAGES: false,
              SEND_MESSAGES: false,
          })
          .then(() => callback(null, newRole, textChan, voiceChan))
          .catch(callback);
        },
        (newRole, textChan, voiceChan, callback) => {
          var everyoneRole = message.guild.roles.find('name', '@everyone');
          voiceChan.overwritePermissions(everyoneRole, {
            CONNECT: false,
            SPEAK: false,
          })
          .then(() => callback(null, newRole, textChan, voiceChan))
          .catch(callback);
        },
      ], (err) => {
        if (err) {
          debug("An error occurred", err);
        }

        allowedRoles.push(slug(group));
        bot.config.set('allowedRoles', allowedRoles);

        debug("Text and voice channels created");
        bot.reply(message, `Created the channels and group for ${group}`);
      });
    },
  }