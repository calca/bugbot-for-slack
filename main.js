var fs = require('fs');
var config = require('config');
var Botkit = require('botkit/lib/Botkit.js');
var os = require('os');
var util = require('util');

console.log('Environment: ' + process.env.NODE_ENV);

var slackToken = config.get('slack.token');
if (!slackToken) {
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
        ['direct_mention'],
        function(bot, message) {
            // https://api.slack.com/events/message
            if (message.match.length > 0) {
                var name = message.match[0];
                var id = message.match[1];
                if (id) {
                    // check adapter
                    if (tracker.adapter) {
                        var m = require(tracker.adapter.module);
                        m.getIssue(tracker.adapter.config, id)
                            .then(function(res) {
                                var msg = {};
                                //msg.text = '<' + res.link + "|" + res.title + ">";

                                var details = {};
                                //details.pretext = res.link;
                                details.fallback = res.title + "\n" + res.link;
                                details.title = res.title;
                                details.title_link = res.link; 
                                details.color = "danger";
                                //details.text = res.description;

                                details.fields = [];
                                if (res.reporter) {
                                    var reporter = {};
                                    reporter.title = "Reporter";
                                    reporter.value = res.reporter;
                                    reporter.short = true;
                                    details.fields.push(reporter);
                                }

                                if (res.status) {
                                    var level = {};
                                    level.title = "Stato";
                                    level.value = res.status;
                                    reporter.short = true;
                                    details.fields.push(level);
                                }
                                
                                msg.attachments = [];
                                msg.attachments.push(details);

                                bot.reply(message, msg, function(err, response) {
                                    if (err) console.log(err);
                                });
                            })
                    }
                }
            }
        });

}, this);

