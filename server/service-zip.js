const Queue = require('bee-queue');
const zipQueue = new Queue('zip', { removeOnSuccess: true });
const unzipQueue = new Queue('unzip', { removeOnSuccess: true });

var yazl = require("yazl");
var fs = require("fs");
var path = require("path");
var yauzl = require("yauzl");


unzipQueue.process(function(job, done) {
    yauzl.open(job.data.files.inputFile, function(err, zipfile) {
        if (err) throw err;
        zipfile.on("entry", function(entry) {
            if (/\/$/.test(entry.fileName)) {
                // Directory file names end with '/'.
                // Note that entires for directories themselves are optional.
                // An entry's fileName implicitly requires its parent directories to exist.
            }
            else {
                // file entry
                zipfile.openReadStream(entry, function(err, readStream) {
                    if (err) throw err;
                    var fName = path.join(job.data.outputFolder, entry);
                    readStream.pipe(fs.createWriteStream(fName));
                });
            }
        });
    });

});


zipQueue.process(function(job, done) {
    console.log(`Zip: pick job ${job.id}`);
    console.log('Data' + JSON.stringify(job.data));
    var fName = path.join(job.data.outputFolder, job.data.job + ".zip");

    var zipfile = new yazl.ZipFile();

    try {
        Object.entries(job.data.files).forEach(([key, value]) => {
            zipfile.addFile(value);
        });

    }
    catch (ex) {
        return done(ex);
    }

    var strm = zipfile.outputStream;

    strm.on("close", function() {
        return done(null, fName);
    });

    strm.on("error", function(err) {
        return done(err);
    });

    strm.pipe(fs.createWriteStream(fName));

    zipfile.end();


});
