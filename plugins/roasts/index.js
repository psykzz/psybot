'use strict';
var debug = require('debug')('PsyBot');

const ROASTS = [
    `Your family tree is a fucking circle.`,
    `I'd give you a nasty look but you've already got one.`,
    `If you're going to be two-faced, at least make one of them pretty.`,
    `I love what you've done with your hair. How do you get it to come out of the nostrils like that?`,
    `If laughter is the best medicine, your face must be curing the world.`,
    `The only way you'll ever get laid is if you crawl up a chicken's ass and wait.`,
    `It looks like your face caught fire and someone tried to put it out with a hammer.`,
    `If I wanted a bitch, I'd have bought a dog.`,
    `I'd like to see things from your point of view, but I can't seem to get my head that far up your ass.`,
    `I've seen people like you before, but I had to pay admission.`,
    `Scientists say the universe is made up of neutrons, protons and electrons. They forgot to mention morons.`,
    `You're so fat you could sell shade.`,
    `Why is it acceptable for you to be an idiot but not for me to point it out?`,
    `Your lips keep moving but all I hear is "Blah, blah, blah."`,
    `Your family tree must be a cactus because everyone on it is a prick.`,
    `You'll never be the man your mother is.`,
    `Did you know they used to be called "Jumpolines" until your mum jumped on one?`,
    `Just because you have one doesn't mean you need to act like one.`,
    `I'm sorry, was I meant to be offended? The only thing offending me is your face.`,
    `Someday you'll go far... and I hope you stay there.`,
    `Which sexual position produces the ugliest children? Ask your mother.`,
    `Stupidity's not a crime, so you're free to go.`,
    `If I had a face like yours I'd sue my parents.`,
    `Your doctor called with your colonoscopy results. Good news - they found your head.`,
    `No, those pants don't make you look fatter - how could they?`,
    `What's the difference between your girlfriend and a walrus? One has a moustache and smells of fish and the other is a walrus.`,
    `Save your breath - you'll need it to blow up your date.`,
    `You're not stupid; you just have bad luck when thinking.`,
    `If you really want to know about mistakes, you should ask your parents.`,
    `Please, keep talking. I always yawn when I am interested.`,
    `The zoo called. They're wondering how you got out of your cage?`,
    `Jesus loves you... but everyone else thinks you're an asshole.`,
    `Whatever kind of look you were going for, you missed.`,
    `I was hoping for a battle of wits but you appear to be unarmed.`,
    `Hey, you have something on your chin... no, the 3rd one down.`,
    `Aww, it's so cute when you try to talk about things you don't understand.`,
    `I don't know what makes you so stupid, but it really works.`,
    `You are proof that evolution can go in reverse.`,
    `Brains aren't everything. In your case they're nothing.`,
    `I thought of you today. It reminded me to take the garbage out.`,
    `You're so ugly when you look in the mirror, your reflection looks away.`,
    `When you were born, the doctor came out to the waiting room and said to your dad, "I'm very sorry. We did everything we could. But he pulled through."`,
    `I'm sorry I didn't get that - I don't speak idiot.`,
    `Quick - check your face! I just found your nose in my business.`,
    `It's better to let someone think you're stupid than open your mouth and prove it.`,
    `Hey, your village called - they want their idiot back.`,
    `Were you born this stupid or did you take lessons?`,
    `I've been called worse by better.`,
    `You're such a beautiful, intelligent, wonderful person. Oh I'm sorry, I thought we were having a lying competition.`,
    `I may love to shop but I'm not buying your bull.`,
    `Don't you get tired of putting make up on two faces every morning?`,
    `I'd slap you but I don't want to make your face look any better.`,
    `Calling you an idiot would be an insult to all stupid people.`,
    `Gay? I'm straighter than the pole your mom dances on.`,
    `I just stepped in something that was smarter than you... and smelled better too.`,
    `You have the right to remain silent because whatever you say will probably be stupid anyway.`,
];

function roast(bot, message) {
    const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    const mentions = message.mentions.members.array();
    if(mentions && mentions.length > 0) {
        return message.channel.send(`${mentions.join(', ')}, ${roast}`)
    }
    bot.reply(message, roast, -1);
}

module.exports.self = {
    enabled: true,
    prefix: "!roast",
    callback: roast
}

module.exports.others = {
    enabled: true,
    prefix: "!roast ",
    args: true,
    callback: roast
}