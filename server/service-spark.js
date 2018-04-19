const Queue = require('bee-queue');
const sparkQueue = new Queue('spark', { removeOnSuccess: true });
const { exec } = require('child_process');
var config = require('./config.json');
var fs = require('fs'); // file system


// OR read from file & ppend parametrs??? Better in terms of managing shit. Yeah right thing to do

sparkQueue.process(function(job, done) {
    /*    var command = "/home/ubuntu/workspace/spark/bin/spark-submit \\" + "\n"
        var command = command + "\" --class supervisedCoding\" \\" + "\n"
        var command = command + " --master local \\" + "\n"
        var command = command + " /home/ubuntu/workspace/spark/scripts/SupervisedCoding/target/scala-2.11/supervised-coding_2.11-1.01.jar \\" + "\n"
        var command = command + trainData + "\n"
        var command = command + testData + "\n"
        var command = command + codeFrame
    */
    console.log("SPARK JOB INPUT DATA:" + JSON.stringify(job.data));
    console.log("SPARK Script:" + config.scripts.supervisedCoding);


    var trainData = job.data.files.trainData;
    var testData = job.data.files.testData;
    var codeFrame = job.data.files.codeFrame;
    var tempFolder = job.data.tempFolder;
    var error = "";

    var execScript = config.scripts.supervisedCoding + " " + trainData + " " + testData + " " + codeFrame + " " + tempFolder;
    console.log(execScript);

    const child = exec(execScript);
    //    rstream.pipe(wstream);

    //    child.stdout.on('data', (data) => {
    //       console.log(`stdout: ${data}`);
    //   });

    var wstream = fs.createWriteStream('myFileToWriteTo');
    child.stdout.pipe(wstream);

    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        error = error + data;
    });

    child.on('exit', function(code, signal) {
        if (code) return done(error);
        done(null, "I'm kinda done with code:" + code); //need to rename / pick output file name. ZIPPP
    });

    child.unref();

});
