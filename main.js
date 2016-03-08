var fs    = require('fs');
var config = require('config');
var Botkit = require('botkit/lib/Botkit.js');
var os = require('os');
var util = require('util');

console.log('Environment: ' + process.env.NODE_ENV);

var slackToken =  config.get('slack.token');
if( !slackToken){
  console.log("Slack token is empty");
  process.exit(1);
}

// Start Bot
var controller = Botkit.slackbot({
    debug: config.get('slack.debug'),
});

var bot = controller.spawn({
    token: slackToken
}).startRTM();

var trackers = config.get('trackers');

trackers.forEach(function(tracker) {
    
    // Start Tracker  
    controller.hears([tracker.messagePattern],
    ['direct_message','direct_mention','mention','ambient'],
    function(bot,message) {
    // https://api.slack.com/events/message
    if(message.match.length > 0){
         var name = message.match[0];
         var id = message.match[1];
         if(id){
            var msg = util.format(tracker.message,name,id);
            bot.reply(message,msg);
         }
    }
});
    
}, this);

