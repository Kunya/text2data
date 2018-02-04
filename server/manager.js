//const catchify = require('catchify');
const Queue = require('bee-queue');

function processJob(jobType, optionns) {

  return new Promise((resolve, reject) => {
    console.log('Manager: Starting job type:' + jobType);
    switch (jobType) {
      case 'lemmer':
        resolve(processFile(optionns.file, "lemmer"));
        break;
      case 'textClustering':
        processFile(optionns.inputFile, "lemmer").then((res) => {
          resolve(processFile(res, "spark"));
        }).catch((err) => { reject(err); });
        break;
      default:
        reject("Job type - " + jobType + " is not supported.");
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

function processFile(file, queque) {

  return new Promise((resolve, reject) => {
    console.log('Starting job in queue:' + queque + ', for file: ' + file);

    const thatQueue = new Queue(queque, { removeOnSuccess: true });

    var job = thatQueue.createJob({ file: file });
    job.on('failed', (err) => { reject(err); });
    job.on('succeeded', (result) => { resolve(result); });
    job.save().catch(function(err) { reject(err); });

  });
}

module.exports = { processJob: processJob };
