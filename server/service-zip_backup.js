const Queue = require('bee-queue');
const zipQueue = new Queue('zip', { removeOnSuccess: true });
const unzipQueue = new Queue('unzip', { removeOnSuccess: true });
var config = require('./config.json');
var yazl = require("yazl");
var S3FS = require('s3fs');
var fs = new S3FS(config.s3.bucket, config.s3.options);
var path = require("path");
var yauzl = require("yauzl");


// TESTING

function test() {

    var data = { zip: {} };
    data.zip.files = [];
    data.zip.files.push('text2data/userdata/5a09816a6659240a066b0c25/Inputs/codeframe.txt');
    data.zip.files.push('text2data/userdata/5a09816a6659240a066b0c25/Inputs/data2Code.txt');
    data.zip.folder = 'text2data/userdata/5a09816a6659240a066b0c25/Outputs';
    data.zip.outputName = 'brozzy.zip';

    const thatQueue = new Queue("zip", { removeOnSuccess: true });

    const job = thatQueue.createJob(data);
    job.on('failed', (err) => { console.log(err); });
    job.on('succeeded', (result) => { console.log(result); });
    job.save().then(() => { console.log("Job was added."); }).catch(function(err) { console.log(err); });
}

test();

//

unzipQueue.process(function(job, done) {
    yauzl.open(job.data.unzip.inputFile, function(err, zipfile) {
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
                    var fName = path.join(job.data.unzip.folder, entry);
                    readStream.pipe(fs.createWriteStream(fName));
                });
            }
        });
    });

});


zipQueue.process(function(job, done) {
    console.log(`Zip: pick job ${job.id}`);
    console.log('Data' + JSON.stringify(job.data));
    var fName = path.join(job.data.zip.folder, job.data.zip.outputName);
    console.log("Zip file:" + fName);
    var zipfile = new yazl.ZipFile(fs);
    var strm = zipfile.outputStream.pipe(fs.createWriteStream(fName));

    strm.on("close", function() {
        console.log("Close stream");
        return done(null, fName);
    });

    strm.on("error", function(err) {
        console.log("Error in stream");
        return done(err);
    });
    strm.on("data", function(chunk) {
        console.log("Data:" + chunk);
    });

    job.data.zip.files.forEach((value) => {
        console.log("Adding to zip file:" + value);

        fs.exists(value, (exists) => {
            if (exists) {
                //zipfile.addFile(value, path.basename(value));
                var fstream = fs.createReadStream(value);
                zipfile.addReadStream(fstream, path.basename(value));

            }
            else { return done(new Error("Error adding file to zip archive: " + value)); }
        });


    });


    zipfile.end();

});
