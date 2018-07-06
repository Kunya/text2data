var config = require('./config.json');
var Project = require('./projectModel.js').Project;
var express = require('express');
var router = express.Router();
var VerifyToken = require('./verifyToken.js');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var aws = require('aws-sdk');
var S3FS = require('s3fs');
var fileSystem = new S3FS(config.s3.bucket, config.s3.options);

var s3 = new aws.S3(config.s3.options);

var uploadFile = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3.bucket,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            if (req.saveToFolder) { cb(null, path.join(req.saveToFolder, file.originalname)); }
            else {
                cb(null, file.originalname);
            }
        }
    }),
    limits: { fileSize: 30 * 1024 * 1024 }
}).single('userData');


/*
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        if (req.saveToFolder) { callback(null, req.saveToFolder); }
        else {
            callback(null, config.storagePath);
        }
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});
*/

//var uploadFile = multer({ storage: storage }).single('userData');


router.post('/upload/:id', VerifyToken, function(req, res) {


    Project.findById(req.params.id, function(err, item) {
        if (err) return res.status(500).send("There was a problem finding item:" + req.params.id + ", " + err);
        if (!item) return res.status(404).send("No item found.");

        req.saveToFolder = path.join(config.storagePath, item._id.toString(), 'Inputs');

        uploadFile(req, res, function(err) {
            if (err) {
                return res.status(500).end("Error uploading file:" + err);
            }
            console.log("Uploaded file " + req.file.originalname);
            console.log("Folder " + req.saveToFolder);

            fileSystem.readdir(req.saveToFolder, function(error, files) {
                if (error) return new Error("Can't read folder:" + req.saveToFolder);

                console.log(files);

            });

            item.inputs.push({
                label: req.file.originalname,
                owner: req.userId,
                created: new Date(),
                //tag:String
            });
            item.markModified('inputs');

            item.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send("There was error adding file to DB.");
                }

                var lastItem = item.inputs[item.inputs.length - 1];
                return res.status(200).send({ id: lastItem._id });

            }.bind(this));

        });

    }.bind(this));


});

//map UI to server API;
//
///
router.delete('/:id/:folder/:file', VerifyToken, async function(req, res) {

    if (!req.params.id) return res.status(400).send('Missing project id in request');
    if (!req.params.file) return res.status(400).send('Missing file in request');
    if (!req.params.folder) return res.status(400).send('Missing folder in request');

    if (["Outputs", "Inputs"].indexOf(req.params.folder) < 0) return res.status(400).send('Folder can be Outputs or Inputs, while get: ' + req.params.folder);


    //check project id & get info
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).send('Project not found, id: ' + req.params.id);

    try {
        var filePath = path.join(config.storagePath, project._id.toString(), req.params.folder.toLowerCase(), path.basename(req.params.file));
    }
    catch (err) {
        return res.status(400).send('Bad file name: ' + req.params.file);
    }

    fileSystem.stat(filePath, function(stats, err) {
        if (err) return res.status(400).send('File not found, name: ' + req.params.file);

        var subId;
        console.log("Deleting file:" + req.params.file);
        for (var i = 0; i < project.inputs.length; i++) {
            if (project.inputs[i].label === req.params.file) { subId = project.inputs[i]._id; }
        }

        if (!subId) return res.status(400).send('File not found in DB, name: ' + req.params.file);

        project.inputs.pull(subId);
        //console.log(project.inputs);
        project.save(function(err) {
            if (err) return res.status(500).send('Save is failed on data base side.');
            res.status(200).send('Deleted');


        });


    });


});

///
router.get('/:id/:folder/:file', VerifyToken, async function(req, res) {

    if (!req.params.id) return res.status(400).send('Missing project id in request');
    if (!req.params.file) return res.status(400).send('Missing file in request');
    if (!req.params.folder) return res.status(400).send('Missing folder in request');



    //check project id & get info
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).send('Project not found, id: ' + req.body.id);

    var filePath = path.join(config.storagePath, project._id.toString(), 'Outputs', path.basename(req.params.file));

    var stat = await fileSystem.stat(filePath);
    if (!stat) return res.status(400).send('File not found, name: ' + req.params.file);

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    res.on('error', function(err) {
        readStream.end();
        console.log("Failed to send file:" + filePath + ", err:" + err);
    });

    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);

});

///

// CREATES A NEW PROJECT

router.post('/create', VerifyToken, function(req, res) {

    Project.create({
        createdBy: req.userId,
        label: req.body.label,
        client: req.body.client,
        domain: req.body.domain,
        type: req.body.type
    }, function(err, user) {

        if (err) return res.status(500).send("There was a problem adding new item:" + err);
        return res.status(200).send({ id: Project._id });
    });

});


// RETURNS ALL ITEMS IN COLLECTION
router.get('/list', VerifyToken, function(req, res) {
    Project.find({}).sort({ '_id': -1 }).exec(function(err, projects) {
        if (err) return res.status(500).send("There was a problem finding items." + err);
        //console.log(JSON.stringify(projects));

        return res.status(200).send(projects);
    });
});

// GETS A SINGLE ITEM FROM THE COLLECTION
router.get('/get/:id', VerifyToken, function(req, res) {
    Project.findById(req.params.id, function(err, user) {
        if (err) return res.status(500).send("There was a problem finding item." + err);
        if (!user) return res.status(404).send("No item found.");

        return res.status(200).send(user);
    });
});

// DELETES ITEM FROM THE COLLECTION
router.delete('/delete/:id', VerifyToken, function(req, res) {
    if (req.params.email) {
        Project.findOneAndRemove(req.params.id, function(err, user) {
            if (err) return res.status(500).send("There was a problem deleting item." + err);
            res.status(200).send("Item was deleted.");
        });
    }
});

// UPDATES A SINGLE ITEM IN THE DATABASE
router.put('/update/:id', VerifyToken, function(req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
        if (err) return res.status(500).send("There was a problem updating item " + err);
        res.status(200).send(user);
    });
});




module.exports = router;
