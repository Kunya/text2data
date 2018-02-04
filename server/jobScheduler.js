const Queue = require('bee-queue');
const jobQueue = new Queue('organizer', { removeOnSuccess: true });
const lemmerQueue = new Queue('srv-lemmer', { removeOnSuccess: true });
const sparkQueue = new Queue('srv-spark', { removeOnSuccess: true });


var jobInQueue = jobQueue.createJob({ type: "clustering", file: "gitfiles.txt" });

jobInQueue.on('succeeded', (result) => {
    console.log("Job is completed! " + result);
});

jobInQueue.on('failed', (err) => {
    console.log("Job failed. " + err);
});

jobInQueue.save().then((job) => {
    console.log("Job is saved!");

}).catch((err) => {
    console.log("Error!" + err);


});
