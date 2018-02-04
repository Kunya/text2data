var MyStem = require('mystem3');
var Promise = require("bluebird");
const Queue = require('bee-queue');
const path = require('path');

const lemmerQueue = new Queue('lemmer', { removeOnSuccess: true });

var myStem = new MyStem();
myStem.start(); // Run mystem in separate process


lemmerQueue.process(function(job, done) {
    console.log(`Processing lemmer job ${job.id}`);
    console.log('Data' + JSON.stringify(job.data));

    var fs = require('fs');
    var lines = [];
    var searchterms = [];
    var linesCount = 1;

    fs.readFile(job.data.file, function(err, data) {
        if (err) {
            return done(new Error("Can't read file:" + job.data.file));
        }
        lines = data.toString().split('\n');
        linesCount = lines.length;

        Promise.each(lines, function(line, lInd) {
            searchterms = lines[lInd].split(' ');
            return Promise.each(searchterms, function(term, ind) {
                return myStem.lemmatize(term).then(function(lemma) { searchterms[ind] = lemma; });
            }).then(function() {
                lines[lInd] = searchterms.join(" ");
                if (lInd % 20 === 0) job.reportProgress((lInd / linesCount).toFixed(0));
            }, function(err) { done(err); }).catch(console.error);
        }).then(function() {

            var newFileName = path.dirname(job.data.file) + "/" + 'lem_' + path.basename(job.data.file);

            fs.writeFile(newFileName, lines.join('\n'), function(err) {
                if (err) {
                    return done(new Error(err));
                }
                return done(null, newFileName);
            });

        });


    });

});
