//var config=require('./config.json');
var express = require('express');
var router = express.Router();
var VerifyToken = require('./verifyToken.js');
var Job = require('./jobModel.js');
var Project = require('./projectModel.js');
const Queue = require('bee-queue');
const jobQueue = new Queue('manager', { removeOnSuccess: true });

router.post('/create', VerifyToken, function(req, res) {
    if (!req.body.projectId) return res.status(400).send('Missing projectId field in request');
    if (!req.body.jobType) return res.status(400).send('Missing jobType field in request');
    if (!req.body.options.inputFile) return res.status(400).send('Missing inputFile in options field in request');

    //çheck job type 
    var jobTypes = ['textClustering', 'çoding'];
    if (jobTypes.indexOf(req.body.jobType) < 0) return res.status(400).send("Unknown job type. Use /api/help call to check valid options.");

    //check project id & get info
    const project = await Project.findById(req.body.projectId).exec();
    if (!project) return res.status(400).send("Project not found, id:" + req.body.projectId);

    var fileName = project.path + '/' + req.body.options.inputFile;

    var newJob = Job.create({
        createdBy: req.userId,
        projectId: project._id,
        registered: Date.now(),
        jobType: req.body.jobType,
        status: "In Queue",
        details: JSON.stringify(req.body.options)
    });

    var jobInQueue = jobQueue.createJob({ file: fileName });
    jobInQueue.on('succeeded', (result) => {
        newJob.status = 'Completed';
        newJob.save();

        project.outputs.push({
            label: result,
            path: project.path
        });

        project.markModified('inputs');
        project.save
    });


    if (!newJob) return res.status(400).send("Error adding job to DB.");

    jobInQueue.save().then((job) => {
        return res.status(200).send({ status: "Queued", id: job.id });
    }).catch(function(err) {
        newJob.status = "Failed: error placing job in queque";
        newJob.save();
        return res.status(500).send("There was a problem adding new item:" + err);
    });

});


// RETURNS ALL ITEMS IN COLLECTION
router.get('/list', VerifyToken, function(req, res) {
    Job.find({ projectId: req.body.projectId }, function(err, projects) {
        if (err) return res.status(500).send("There was a problem finding items." + err);
        //console.log(JSON.stringify(projects));

        return res.status(200).send(projects);
    });
});

// GETS A SINGLE ITEM FROM THE COLLECTION
router.get('/get/:id', VerifyToken, function(req, res) {
    Job.findById(req.params.id, function(err, item) {
        if (err) return res.status(500).send("There was a problem finding item." + err);
        if (!item) return res.status(404).send("No item found.");

        return res.status(200).send(item);
    });
});

// DELETES ITEM FROM THE COLLECTION
router.delete('/delete/:id', VerifyToken, function(req, res) {
    return res.status(200).send("WIP");

    if (req.params.id) {
        Job.findOneAndRemove(req.params.id, function(err, user) {
            if (err) return res.status(500).send("There was a problem deleting item." + err);
            res.status(200).send("Item was deleted.");
        });
    }
});


module.exports = router;
