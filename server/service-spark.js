const Queue = require('bee-queue');
const sparkQueue = new Queue('spark', { removeOnSuccess: true });


sparkQueue.process(function(job, done) {
    console.log(`Processing Spark job ${job.id}`);
    done(null, "I'm kinda done!");
});
