var config=require('./config.json');
var Project = require('./projectModel.js').Project;
var express=require('express');
var router = express.Router();
var VerifyToken = require('./verifyToken.js');
var multer = require('multer');


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.storagePath );
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});


var uploadFile = multer({ storage : storage}).single('userData');
router.use(uploadFile);


router.post('/upload/:id', VerifyToken, function (req, res) {
     

     Project.findById(req.params.id, function (err, item) {
        if (err) return res.status(500).send("There was a problem finding item:" +req.params.id +", "+ err);
        if (!item) return res.status(404).send("No item found.");
        
        uploadFile(req, res, function(err) {
          if(err) {
            return res.status(500).end("Error uploading file:" + err);
          }
          //console.log("Uploaded file "+req.file.originalname);
          
          item.inputs.push({
            label: req.file.originalname,
            path: config.storagePath
            //tags:[String]
             });
          item.markModified('inputs');  

          item.save(function (err) {
             if (err) {
                 console.log(err);
                 return res.status(500).send("There was error adding file to DB.");
             }
   
             var lastItem=item.inputs[item.inputs.length-1];
             return res.status(200).send({ id:lastItem._id });
         
          }.bind(this));

        });

    }.bind(this));
    
    
});

///
  
///

// CREATES A NEW PROJECT

router.post('/create', VerifyToken, function (req, res) {
  
              Project.create({
                  createdBy: req.userId,
                  label: req.body.label,
                  client: req.body.client,
                  domain: req.body.domain,
                  type: req.body.type
             }, function(err, user) {

                  if (err) return res.status(500).send("There was a problem adding new item:" + err);
                  return res.status(200).send({ id:Project._id });
              });
                
});


// RETURNS ALL ITEMS IN COLLECTION
router.get('/list',VerifyToken, function (req, res) {
    Project.find({}, function (err, projects) {
        if (err) return res.status(500).send("There was a problem finding items." + err);
        //console.log(JSON.stringify(projects));

        return res.status(200).send(projects);
    });
});

// GETS A SINGLE ITEM FROM THE COLLECTION
router.get('/get/:id',VerifyToken,  function (req, res) {
    Project.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding item." + err);
        if (!user) return res.status(404).send("No item found.");
        
        return res.status(200).send(user);
    });
});

// DELETES ITEM FROM THE COLLECTION
router.delete('/delete/:id',VerifyToken, function (req, res) {
    if (req.params.email) {
        Project.findOneAndRemove(req.params.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting item." + err);
          res.status(200).send("Item was deleted.");
        }); 
    }
});

// UPDATES A SINGLE ITEM IN THE DATABASE
router.put('/update/:id',VerifyToken, function (req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating item " +err);
        res.status(200).send(user);
    });
});


module.exports=router;
