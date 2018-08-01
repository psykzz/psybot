'use strict';
require('dotenv').config();
require('debug').enable('PsyBot');
var debug = require('debug')('PsyBot');

const path = require('path')
const app = require('express')()

var PsyBot = require('./src/psy-bot');

var token = process.env.DISCORD_TOKEN;
var bot = new PsyBot(token);

bot.addCommands([
  require('./plugins/help'),
  require('./plugins/debug'),
  require('./plugins/prune'),
  require('./plugins/roasts').self,
  require('./plugins/roasts').others,
  require('./plugins/everyone-ree'),
  require('./plugins/twitter'),
  require('./plugins/server-query'),
  // require('./plugins/group-helper').help,
]);


bot.addEventHandlers({
  'presenceUpdate': [
    require('./plugins/game-tracking'),
  ]
});

app.get('*', (req, res) => res.sendFile('psybot-data.json', { root: path.join(__dirname, 'data') }));
app.listen(3000, () => debug('Listening on 3000'))