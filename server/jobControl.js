var config = require('./config.json');
var express = require('express');
var router = express.Router();
var VerifyToken = require('./verifyToken.js');
var Job = require('./jobModel.js');
var jobManager = require('./manager.js');
var Project = require('./projectModel.js').Project;
var path = require("path");

router.post('/create', VerifyToken, async function(req, res) {
    if (!req.body.projectId) return res.status(400).send('Missing projectId field in request');
    if (!req.body.jobType) return res.status(400).send('Missing jobType field in request');
    if (!req.body.options.inputFile) return res.status(400).send('Missing inputFile in options field in request');

    //çheck job type 
    var jobTypes = ['textClustering', 'textCoding', 'lemmer'];
    if (jobTypes.indexOf(req.body.jobType) < 0) return res.status(400).send("Unknown job type. Use /api/help call to check valid options.");

    //check project id & get info
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(400).send("Project not found, projectId:" + req.body.projectId);
    console.log('project found:' + project._id);
    const newJob = await Job.create({
        createdBy: req.userId,
        projectId: project._id,
        registered: Date.now(),
        jobType: req.body.jobType,
        status: "Created",
        details: JSON.stringify(req.body.options)
    });

    if (!newJob) return res.status(400).send("Failed to save new job to database");
    res.status(200).send({ status: "Created", jobId: newJob._id });

    console.log('Job created');
    var options = {};
    options.file = path.join(config.storagePath, project._id.toString(), 'Inputs', req.body.options.inputFile);
    options.tempFolder = path.join(config.storagePath, project._id.toString(), 'Temp');
    options.outputFolder = path.join(config.storagePath, project._id.toString(), 'Outputs');
    options.jobType = req.body.jobType;
    options.project = project._id.toString();
    console.log(options.file);
    //var jobInQueue = jobQueue.createJob({ file: fileName });

    jobManager.processJob(options).then((result) => {
        console.log("Job is completed!");
        newJob.status = 'Completed';
        newJob.save();

        project.outputs.push({
            label: path.basename(result)
        });
        project.markModified('outputs');
        project.save();


    }).catch((err) => {
        newJob.status = 'Failed:' + err;
        newJob.save();

    });


});


// RETURNS ALL ITEMS IN COLLECTION
router.get('/list', VerifyToken, function(req, res) {

    Job.find({ projectId: req.query.projectId }).sort({ '_id': -1 }).limit(16).exec(function(err, projects) {
        if (err) return res.status(500).send("There was a problem finding items." + err);

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
