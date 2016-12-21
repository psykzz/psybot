'use strict';
var Discord = require("discord.js"),
    fs = require("fs");

var options = {
    disableEveryone: true
}

var client = new Discord.Client(options);
var token = process.env.DISCORD_TOKEN

var allowedRoles = [];
fs.readFile('./data/allowedRoles.json', 'utf8', function (err, data) {
    if (err) {
        allowedRoles = [];
        return
    } // we'll not consider error handling for now
    allowedRoles = JSON.parse(data);
});

client.on('message', function(message) {
    if (message.channel.type != 'text') {
            console.log(`(Private) ${message.author.name}: ${message.content}`);
    } else {
        try {
            console.log(`(- ${message.channel.guild.name} / #${message.channel.name}) ${message.author.username}: ${message.content}`);
        } catch (err) {
            console.log(`(- !!(Private) ${message.author.name}: ${message.content}`);
        }
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

    if(message.author.bot || message.channel.type != 'text') {
        return;
    }

    command('!group help', message, function(e, _) {
        message.reply(`**GROUP HELP**

            **Admin shit**

            \`!group ban <group>\` - bans a specific group
            \`!group unban <group>\` - unbans a specific group

            **User shit**

            \`!groups\` - Shows all availble groups
            \`!group join <group>\` - Joins a group
            \`!group leave <group>\` - Joins a group

        Shout at **Midge** if its broken`)
    })

    command('!group bans', message, function(err, arg) {
        return; // no longer needed
        message.reply(allowedRoles.join(', '))
    })
    command('!group unban ', message, function(err, group) {

        if(!message.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            message.reply('fu skrub no access for you')
        }

        var role;
        
        var availableRoles = message.guild.roles.filter(function(item) {
            if(item.name.toLowerCase() == group.toLowerCase()) {
                role = item;
            }
            return (allowedRoles.indexOf(item.name) !== -1)
        }).map(function(item) {
            return item.name
        })

        if(availableRoles.indexOf(role.name) !== -1) {
            message.reply("incorrect group.")
            return
        }

        allowedRoles.push(role.name)
        fs.writeFile('./data/allowedRoles.json', JSON.stringify(allowedRoles) , 'utf-8');
        message.reply(`unbanned ${role.name}`)
    });
    command('!group ban ', message, function(err, group) {

        if(!message.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            message.reply('fu skrub no access for you')
        }
    
        var role;
        
        var availableRoles = message.guild.roles.filter(function(item) {
            if(item.name.toLowerCase() == group.toLowerCase()) {
                role = item;
            }
            return (allowedRoles.indexOf(item.name) !== -1)
        }).map(function(item) {
            return item.name
        })
        
        var index = allowedRoles.indexOf(role.name);
        if (index === -1) {
            message.reply("incorrect group.")
            return
        }

        allowedRoles.splice(index, 1);
        fs.writeFile('./data/allowedRoles.json', JSON.stringify(allowedRoles) , 'utf-8');
        message.reply(`banned ${role.name}`)
    });

    command('!groups', message, function(err) {

        var availableRoles = message.guild.roles.filter(function(item) {
            return (allowedRoles.indexOf(item.name) !== -1)
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
            if(item.name.toLowerCase() == group.toLowerCase()) {
                role = item;
            }
            return (allowedRoles.indexOf(item.name) !== -1)
        }).map(function(item) {
            return item.name
        })

        if (!availableRoles.length) {
            message.reply("no roles available.")
            return
        }

        if(availableRoles.indexOf(role.name) === -1 || !role) {
            message.reply('group is not whitelisted or is invalid')
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
            if(item.name.toLowerCase() == group.toLowerCase()) {
                role = item;
            }
            return (allowedRoles.indexOf(item.name) !== -1)
        }).map(function(item) {
            return item.name
        })

        if (!availableRoles.length) {
            message.reply("no roles available.")
            return
        }

        if(availableRoles.indexOf(role.name) === -1 || !role) {
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
