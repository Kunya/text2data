const Queue = require('bee-queue');
const sparkQueue = new Queue('spark', { removeOnSuccess: true });
const { exec } = require('child_process');
var config = require('./config.json');


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
    var trainData = job.trainData;
    var testData = job.testData;
    var codeFrame = job.codeFrame;

    const child = exec(config.scripts.supervisedCoding, [trainData, testData, codeFrame]);

    child.on('exit', function(code, signal) {
        done(null, "I'm kinda done!"); //need to rename / pick output file name. ZIPPP
    });

    child.unref();



});
