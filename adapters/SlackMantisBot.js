var request = require('request');
var Q = require('q');

var SlackMantisBot = function() { };

SlackMantisBot.prototype.getIssue = function(config, id) {

    return Q.fcall(function() {
        var res = {
            id: id,
            title: 'Mantis: ' + id,
            link: config.host + '/view.php?id=' + id
        }
        return res;
    });

    //var deferred = Q.defer();
    // request.get(url,
    //     function(error, message, response) {
    //         if (error)
    //             deferred.reject(error);

    //         var a = JSON.parse(response);
    //         var res = {
    //             id: a.issue.id,
    //             title: a.issue.subject,
    //             description: a.issue.description,
    //             status: a.issue.status.name,
    //             reporter: a.issue.author.name,
    //             link: config.host + '/issues/' + id
    //         };
    //         deferred.resolve(res);
    //     });
    //return deferred.promise;
}

module.exports = new SlackMantisBot;