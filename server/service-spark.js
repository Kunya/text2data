const Queue = require('bee-queue');
const sparkQueue = new Queue('spark', { removeOnSuccess: true });


sparkQueue.process(function(job, done) {
    console.log(`Processing lemmer job ${job.id}`);
    done(null, "I'm kinda done!");
});
