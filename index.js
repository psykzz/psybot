'use strict';
var Discord = require("discord.js"),
    fs = require("fs");

var options = {
    disableEveryone: true
}

var client = new Discord.Client(options);
var token = process.env.DISCORD_TOKEN

var bannedGroups = [];
fs.readFile('./data/bannedRoles.json', 'utf8', function (err, data) {
    if (err) {
        bannedGroups = [];
        return
    } // we'll not consider error handling for now
    bannedGroups = JSON.parse(data);
});

client.on('message', function(message) {
    // console.log(message);
    if (message.channel.isPrivate) {
            console.log(`(Private) ${message.author.name}: ${message.content}`);
    } else {
            console.log(`(- ${message.channel.guild.name} / #${message.channel.name}) ${message.author.username}: ${message.content}`);
    }
});

function command(prefix, message, cb) {
    if(message.content.indexOf(prefix) !== 0) {
        return;
    }

    var restOfMessage = message.content.substr(prefix.length);
    cb(null, restOfMessage);
}

client.on("message", function(message) {

    command('!group help', message, function(e, _) {
        message.reply(`**GROUP HELP**

            **Admin shit**


            \`!group admin <group>\` - Group required for admin shit
            \`!group bans\` - Shows all banned groups
            \`!group ban <group>\` - bans a specific group
            \`!group unban <group>\` - unbans a specific group

            **User shit**

            \`!groups\` - Shows all availble groups
            \`!group join <group>\` - Joins a group
            \`!group leave <group>\` - Joins a group

        Shout at **Midge** if its broken`)
    })

    command('!group admin ', message, function(err, group) {
        var role
        message.guild.roles.map(r => {
            if(r.name === group) {
                role = r
            }
        })

        if(!role) {
            message.reply('invalid group')
        }

    })

    command('!group bans', message, function(err, arg) {
        message.reply(bannedGroups.join(', '))
    })
    command('!group ban ', message, function(err, group) {

        if(!message.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            message.reply('fu skrub no access for you')
        }

        var availableRoles = message.guild.roles.filter(function(item) {
            return (bannedGroups.indexOf(item.name) === -1)
        }).map(function(item) {
            return item.name
        })

        if(availableRoles.indexOf(group) === -1) {
            message.reply("incorrect group.")
            return
        }

        bannedGroups.push(group)
        fs.writeFile('./data/bannedRoles.json', JSON.stringify(bannedGroups) , 'utf-8');
        message.reply(`banned ${group}`)
    });
    command('!group unban ', message, function(err, arg) {

        if(!message.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            message.reply('fu skrub no access for you')
        }

        var index = bannedGroups.indexOf(arg);
        if (index === -1) {
            message.reply("incorrect group.")
            return
        }
        bannedGroups.splice(index, 1);

        fs.writeFile('./data/bannedRoles.json', JSON.stringify(bannedGroups) , 'utf-8');
        message.reply(`unbanned ${arg}`)
    });

    command('!groups', message, function(err) {

        var availableRoles = message.guild.roles.filter(function(item) {
            return (bannedGroups.indexOf(item.name) === -1)
        }).map(function(item) {
            return item.name
        })

        if (!availableRoles.length) {
            message.reply("no roles available.")
            return
        }

        message.reply(availableRoles.join(', '))

    })

    command('!group join ', message, function(err, group) {

        var role

        var availableRoles = message.guild.roles.filter(function(item) {
            if(item.name == group) {
                role = item;
            }
            return (bannedGroups.indexOf(item.name) === -1)
        }).map(function(item) {
            return item.name
        })

        if (!availableRoles.length) {
            message.reply("no roles available.")
            return
        }

        if(availableRoles.indexOf(group) === -1 || !role) {
            message.reply('invalid group')
            return
        }

        message.member.addRole(role).then(_ => {
            message.reply(`added \`${role.name}\` role`)
        }).catch(e => {
            console.log(e);
        })

    })

    command('!group leave ', message, function(err, group) {

       var role

        var availableRoles = message.guild.roles.filter(function(item) {
            if(item.name == group) {
                role = item;
            }
            return (bannedGroups.indexOf(item.name) === -1)
        }).map(function(item) {
            return item.name
        })

        if (!availableRoles.length) {
            message.reply("no roles available.")
            return
        }

        if(availableRoles.indexOf(group) === -1 || !role) {
            message.reply('invalid group')
            return
        }

        message.member.removeRole(role).then(_ => {
            message.reply(`removed \`${role.name}\` role`)
        }).catch(e => {
            console.log(e);
        })

    })

});


client.login(token).then(token => {
    console.log('Successfully logged in');
    client.user.setGame('with Midge\'s mum');
    client.user.setUsername('GroupBot')
     .then(user => console.log(`Updated username: ${user.username}`))
     .catch(console.log);
}).catch(error => console.log('There was an error logging in: ' + error));
