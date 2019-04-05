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
}


async function playSound(bot, msg, args) {
    if (!msg.member.voiceChannel) return
    const soundPath = SOUNDS[args.trim()];
    if (!soundPath || !fs.existsSync(path.resolve(__dirname, soundPath))) return msg.reply(`That sound doesn't exist. ${args.trim()} -> ${soundPath}`);

    if (!msg.member.voiceChannel.joinable) return msg.reply(`I don't have access to that channel.`);
    if (!msg.member.voiceChannel.speakable) return msg.reply(`I can't speak in that channel.`);

    let connection = await msg.member.voice.channel.join();
    let dispatcher = connection.play(soundPath, {
        volume: 1,
        passes: 5
    });

    dispatcher.on('finish', (reason) => {
        connection.disconnect();
        msg.delete();
    });
}

module.exports = {
    enabled: true,
    prefix: '!play',
    args: true,
    callback: playSound
}
