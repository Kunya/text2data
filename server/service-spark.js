const Queue = require('bee-queue');
const sparkQueue = new Queue('spark', { removeOnSuccess: true });
const { exec } = require('child_process');
var config = require('./config.json');
var path = require('path');
var S3FS = require('s3fs');
var fs = new S3FS(config.s3.bucket, config.s3.options);

var prefix = "s3a://" + config.s3.options.accessKeyId + ":" + config.s3.options.secretAccessKey + "@" + config.s3.bucket + "/";

sparkQueue.process(function(job, done) {
    console.log("SPARK JOB INPUT DATA:" + JSON.stringify(job.data));

    var trainData = prefix + job.data.files.trainData;
    var testData = prefix + job.data.files.testData;
    var codeFrame = prefix + job.data.files.codeFrame;
    var sparkFolder = prefix + job.data.folder;

    var execScript = config.scripts.supervisedCoding + " " + trainData + " " + testData + " " + codeFrame + " " + sparkFolder;
    console.log("SPARK Command:" + execScript);

    var files = [];
    files.push(path.join(job.data.folder, 'codingEvaluation.txt'));

    exec(execScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return done(error);
        }

        fs.writeFile(files[0], stdout, function(err) {
            if (err) {
                console.log(err);
                return done(err);
            }
            console.log("stdout is written to " + path.basename(files[0]));
        });

        console.log(`stderr: ${stderr}`);
        fs.readdir(path.join(job.data.folder, 'coded'), function(err, found) {
            if (err) {
                console.log(err);
                return done(err);
            }
            console.log("Spark job is finished.");
            found.filter(x => x.indexOf("csv") > 0).forEach(z => files.push(path.join(job.data.folder, 'coded', z)));
            return done(null, files); //need to rename / pick output file name. ZIPPP
        });


    });

});
