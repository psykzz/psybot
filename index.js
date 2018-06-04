'use strict';
require('dotenv').config();
require('debug').enable('PsyBot');
var debug = require('debug')('PsyBot');


var PsyBot = require('./src/psy-bot');

var token = process.env.DISCORD_TOKEN || 'MzM4MDAxODAyMjkxMDUyNTQ0.DfdD7w.V5KfrnPHvqWhv5iycWNp07ohTYs';
var bot = new PsyBot(token);

bot.addCommands([
  require('./plugins/help'),
  require('./plugins/debug'),
  require('./plugins/prune'),
  require('./plugins/roasts').self,
  // require('./plugins/roasts').others,
  require('./plugins/twitter'),
  // require('./plugins/group-helper').help,
]);
