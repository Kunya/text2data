//const catchify = require('catchify');
const Queue = require('bee-queue');
const managerQueue = new Queue('manager', { removeOnSuccess: true });
const lemmerQueue = new Queue('lemmer', { removeOnSuccess: true });
const sparkQueue = new Queue('spark', { removeOnSuccess: true });

/*
async function example(promise) {
  const [error, value] = await catchify(promise);
  if (error) console.log(error);
}
*/

managerQueue.process(function(job, done) {

  console.log(`Manager: processing job ${job.id}`);

  switch (job.data.type) {
    case "clustering":
      processClustering(job, done);
      break;
    case "coding":
      processCoding(job, done);
      break;
    default:
      done("Unknown job type:" + job.data.type);
  }
});

function processClustering(job, done) {

  const fileName = job.data.fileName;
  var jobLemmer = lemmerQueue.createJob({ file: fileName });

  jobLemmer.on('progress', (progress) => {
    job.reportProgress(progress / 2);
  });


  jobLemmer.on('succeeded', (result) => {

    var sparkJob = sparkQueue.createJob({ file: result });
    sparkJob.on('progress', (progress) => {
      job.reportProgress(50 + progress / 2);
    });

    sparkJob.on('succeeded', (resFinal) => {
      done(null, resFinal);
    });

    sparkJob.save().catch(function(err) {
      return done("Error: Failed to add job for Spark service - " + err);
    });

  });

  jobLemmer.save().catch(function(err) {
    return done("Error: Failed to add job for Lemmer service - " + err);
  });

}

function processCoding(job, done) {

  const fileName = job.data.fileName;
  var jobLemmer = lemmerQueue.createJob({ file: fileName });

  jobLemmer.on('progress', (progress) => {
    job.reportProgress(progress / 2);
  });


  jobLemmer.on('succeeded', (result) => {

    var sparkJob = sparkQueue.createJob({ file: result });
    sparkJob.on('progress', (progress) => {
      job.reportProgress(50 + progress / 2);
    });

    sparkJob.on('succeeded', (resFinal) => {
      done(null, resFinal);
    });

    sparkJob.save().catch(function(err) {
      return done("Error: Failed to add job for Spark service - " + err);
    });

  });

  jobLemmer.save().catch(function(err) {
    return done("Error: Failed to add job for Lemmer service - " + err);
  });

}

module.exports = managerQueue;
