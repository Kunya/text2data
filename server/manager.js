//const catchify = require('catchify');
const Queue = require('bee-queue');
const myMkdirSync = require('./utilities.js');
const fileSystem = require('fs');



//https://github.com/bee-queue/bee-queue/issues/83
//handle redis connection errors


function processJob(options) {

  //Prepare folder. Code is not safe, huh?
  try { fileSystem.statSync(options.outputFolder); }
  catch (err) { myMkdirSync(options.outputFolder); }
  try { fileSystem.statSync(options.tempFolder); }
  catch (err) { myMkdirSync(options.tempFolder); }


  return new Promise((resolve, reject) => {
    console.log('Manager: Starting job type:' + options.jobType);
    switch (options.jobType) {
      case 'lemmer':
        resolve(processFile({ file: options.file, folder: options.outputFolder }, "lemmer"));
        break;
      case 'textClustering':
        processFile(options.inputFile, "lemmer").then((res) => {
          resolve(processFile(res, "spark"));
        }).catch((err) => { reject(err); });
        break;
      default:
        reject("Job type - " + options.jobType + " is not supported.");
    }

  });
}

/*async function clusterText(file) {

  const lemmerFile = await processFile(file, "lemmer");
  if (!lemmerFile) return console.log("Error with lemmer");
  const sparkFile = await processFile(lemmerFile, "spark");
  if (!sparkFile) return console.log("Error with spark");
  console.log('Lemmer cool: ' + lemmerFile);
  console.log('Spark cool: ' + sparkFile);

}
*/

function processFile(data, queque) {

  return new Promise((resolve, reject) => {
    console.log('Starting job in queue:' + queque + ', for file: ' + data.file);

    const thatQueue = new Queue(queque, { removeOnSuccess: true });

    const job = thatQueue.createJob(data);
    job.on('failed', (err) => { reject(err); });
    job.on('succeeded', (result) => { resolve(result); });
    job.save().then(() => { console.log("Added."); }).catch(function(err) { reject(err); });

  });
}

module.exports = { processJob: processJob };
