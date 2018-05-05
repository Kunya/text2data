var MyStem = require('mystem3');
var Promise = require("bluebird");
const Queue = require('bee-queue');
const path = require('path');


var myStem = new MyStem();
myStem.start(); // Run mystem in separate process

var job = { id: "whoa", data: {} };
job.reportProgress = function(x) { console.log(100 * x); };
job.data.folder = '/home/ubuntu/workspace/';
job.data.file = '/home/ubuntu/workspace/tolem.txt';
whoa(job, function(x) {
    console.log(x);
    process.exit(101);
});



function whoa(job, done) {
    console.log(`Lemmer: pick job ${job.id}`);
    console.log('Data' + JSON.stringify(job.data));

    var fs = require('fs');
    var lines = [];
    var searchterms = [];
    var columns = [];
    var linesCount = 1;

    fs.readFile(job.data.file, function(err, data) {
        if (err) {
            return done(new Error("Can't read file:" + job.data.file));
        }
        lines = data.toString().split('\n');
        linesCount = lines.length;

        Promise.each(lines, function(line, lInd) {
            columns = line.split('\t');
            searchterms = columns[0].replace(new RegExp('"', 'g'), '').split(' ');

            if (searchterms.length > 0) return Promise.each(searchterms, function(term, ind) {
                return myStem.lemmatize(term).then(function(lemma) { searchterms[ind] = lemma; });
            }).then(function() {
                columns[0] = searchterms.join(" ");
                lines[lInd] = columns.join('\t');
                //if (lInd % 20 === 0) job.reportProgress((lInd / linesCount).toFixed(0));
            }, function(err) { done(err); }).catch(console.error);

            return [];

        }).then(function() {

            var newFileName = path.join(job.data.folder, 'lem_' + path.basename(job.data.file));



            fs.writeFile(newFileName, lines.join('\n'), function(err) {
                if (err) {
                    return done(new Error(err));
                }
                return done(null, newFileName);
            });

        });


    });

};
