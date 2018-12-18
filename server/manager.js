const Queue = require('bee-queue');
var path = require("path");
var config = require("./config.json");


function processJob(options, io) {

  return new Promise((resolve, reject) => {
    console.log('Manager: Starting job type:' + options.jobType);
    switch (options.jobType) {
      case 'lemmer':
        console.log("Emit on job", options.job);
        io.to(options.job).emit({ job: options.job, status: 'Lemmer service' });
        resolve(processFile({ files: options.files, folder: options.outputFolder }, "lemmer"));
        break;
      case 'textCoding':

        //two lemmer jobs + 1 spark job. To be added copy & zip services 
        var params = { files: { inputFile: options.files.trainData }, textColumn: 0 };
        params.folder = path.join(options.tempFolder, "lemmer");
        params.files.codeFrame = options.files.codeFrame;

        console.log("P1:" + JSON.stringify(params.files));
        io.to(options.job).emit('status', { job: options.job, status: 'Lemmer service for trainData' });

        processFile(params, "lemmer").then((res) => {
          console.log("res1:" + JSON.stringify(res));
          params.files.trainData = res;
          params.files.inputFile = options.files.testData;
          params.textColumn = 1;
          console.log("P2:" + JSON.stringify(params.files));
          io.to(options.job).emit('status', { job: options.job, status: 'Lemmer service for testData' });

          return processFile(params, "lemmer");
        }).then((res) => {
          console.log("res2:" + JSON.stringify(res));
          io.to(options.job).emit({ job: options.job, status: 'Coding data' });

          params.files.testData = res;
          params.folder = path.join(options.tempFolder, "spark");
          console.log("P3:" + JSON.stringify(params.files));
          return processFile(params, "spark");
        }).then((res) => {
          console.log("res3:" + JSON.stringify(res));
          io.to(options.job).emit({ job: options.job, status: 'Zip outputs' });

          params.zip = { files: res };
          params.zip.folder = options.outputFolder;
          params.zip.outputName = "coded_" + options.job + "_" + path.basename(options.files.testData) + ".zip";
          console.log("P4:" + JSON.stringify(params.files));
          return processFile(params, "zip");
        }).then((res) => {
          //io.to(options.job).emit({ job: options.job, status: 'Completed');
          console.log("res4:" + JSON.stringify(res));
          resolve(res);
        }).catch((err) => {
          console.log("Job failed: " + err);
          io.to(options.job).emit('status', { job: options.job, status: 'Job Failed' });
          reject(err);
        });
        break;

      default:
        reject("Job type - " + options.jobType + " is not supported.");
    }

    //spark/coded/part-r-00000-11c51b15-ec5c-4505-b756-ba2b71dd5405.csv



  });
}


function processFile(data, queque) {

  return new Promise((resolve, reject) => {
    console.log('Starting job in queue:' + queque + ', Inputs: ' + JSON.stringify(data.files));

    const thatQueue = new Queue(queque, { redis: config.redis, removeOnSuccess: true });

    const job = thatQueue.createJob(data);
    job.on('failed', (err) => { reject(err); });
    job.on('succeeded', (result) => { resolve(result); });
    job.save().then(() => { console.log("Added."); }).catch(function(err) { reject(err); });

  });
}

module.exports = { processJob: processJob };
