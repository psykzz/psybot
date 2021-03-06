'use strict';
var fs = require('fs');
var path = require('path');
var debug = require('debug')('PsyBot');


const SOUNDS = {
    'lettuce': './media/random/15footfungus.ogg',
    'shutdown': './media/random/winxpshutdown.ogg',
    'ree': './media/Jerry/ree.ogg',
    'waaah': './media/random/coffee/Waaaaaah.ogg',
    'wow': './media/random/coffee/Wow.ogg',
    'nazijoke': './media/random/nazi-knockknock.ogg',
    'omae': './media/random/omae.ogg',
    'nani': './media/random/nani.ogg',
    'imfine': './media/random/im-fine.ogg',
    'faces': './media/random/familiar-faces.ogg',
    'hitormiss': './media/random/hit-or-miss.ogg',
    'itsthatsplash': './media/random/what-you-got-on.ogg',
    'donuts': './media/random/eat-some-donuts.ogg',
    'diet': './media/random/you-on-diet.ogg',
    'sadsadsad': './media/random/im-sad-sad-sad.ogg',
    'pee': './media/random/pee.ogg',
}


async function playSound(bot, msg, args) {
    if (!msg.member.voiceChannel) return;
    if (!SOUNDS[args.trim()]) return msg.reply(`That sound doesn't exist. ${args.trim()}`);
    
    const soundPath = path.resolve(__dirname, SOUNDS[args.trim()]);
    if (!soundPath || !fs.existsSync(soundPath)) return msg.reply(`That sound file can't be found. ${args.trim()} -> ${soundPath}`);

    if (!msg.member.voiceChannel.joinable) return msg.reply(`I don't have access to that channel.`);
    if (!msg.member.voiceChannel.speakable) return msg.reply(`I can't speak in that channel.`);

    let connection = await msg.member.voiceChannel.join();
    let dispatcher = await connection.playFile(soundPath);
    
    dispatcher.on('end', (e) => {
        setTimeout(() => {
            msg.delete();
            connection.disconnect();
        }, 3000);
    });
    dispatcher.on('error', (e) => {
        msg.reply('There was an error playing that sound.');
        connection.disconnect();
    });
}


module.exports = {
    enabled: true,
    prefix: '!play',
    args: true,
    callback: playSound
}
