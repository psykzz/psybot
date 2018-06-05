'use strict';
require('dotenv').config();
require('debug').enable('PsyBot');
var debug = require('debug')('PsyBot');
var token = process.env.DISCORD_TOKEN;


var PsyBot = require('./src/psy-bot');

var bot = new PsyBot(token);

bot.addCommands([
  require('./plugins/help'),
  require('./plugins/debug'),
  require('./plugins/prune'),
  require('./plugins/roasts').self,
  require('./plugins/roasts').others,
  require('./plugins/everyone-ree'),
  require('./plugins/twitter'),
  // require('./plugins/group-helper').help,
]);
