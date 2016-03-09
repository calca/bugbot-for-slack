var request = require('request');
var Q = require('q');

var SlackRedmineBot = function() { };

SlackRedmineBot.prototype.getIssue = function(config, id) {
    var url = config.host + '/issues/' + id + '.json';
    url = url + '?key=' + config.apiKey;

    var deferred = Q.defer();
    request.get(url,
        function(error, message, response) {
            if (error)
                deferred.reject(error);

            var a = JSON.parse(response);
            var res = {
                id: a.issue.id,
                title: 'Redmine ' + id + ': ' +  a.issue.subject,
                description: a.issue.description,
                status: a.issue.status.name,
                reporter: a.issue.author.name,
                link: config.host + '/issues/' + id
            };
            deferred.resolve(res);
        });
    return deferred.promise;
}

module.exports = new SlackRedmineBot;