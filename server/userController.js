var config=require('./config.json');
var jwt=require('jsonwebtoken');
var User = require('./userModel.js');
var app=require('express');
var router = app.Router();

var VerifyToken = require('./verifyToken.js');


// CREATES A NEW USER
router.post('/login', function (req, res){
   
   var query = User.find({ email: req.body.email});
   query.limit(1);
   query.exec(function(err, docs) {
    if (err) return res.status(500).send("Error accessing data base:" + err);
    
    var user=docs[0];
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
               } else if (user) 
                  {
                      
                    if (!user.comparePassword(req.body.password)) {
                       return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                     } else {
                      //console.log(user);

                      user.Token=jwt.sign({ _id: user._id, role: user.role }, config.secret, { expiresIn: '24h' });  
                      res.cookie('JWT_SECRET', user.Token, { httpOnly: true, secure: true });
                      res.status(200).send({token: user.Token, email: user.email});
                   }
                   
               }
  });
    
});

router.delete('/deleteAll',VerifyToken, function (req, res) {
  
  User.remove({}, function(err, user) {
        if (err) {
            res.status(500).send("Error occured: " + err);
        } else { res.status(200).send("All users were removed"); } 
 });

 
});

router.post('/create', VerifyToken, function (req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.status(500).send("Error occured: " + err);
        } else {
            if (user) {
                res.status(409).send("User already exists!");
            } else {

              User.create({
                email : req.body.email,
                password : req.body.password,
                created: Date()
               }, function (err, user) {
                
                if (err) return res.status(500).send("There was a problem adding new user:" + err);
                 var token = jwt.sign({ id: user._id }, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                 });
                 res.status(200).send({ id: user.id, token: token });
               });
                
                
            }
        }
    });
});


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/list',VerifyToken, function (req, res) {
    
    //query with mongoose
    var query = User.find({}).select({ "password": 0, "Token":0});

    query.exec(function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
  
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/get/:email',VerifyToken,  function (req, res) {
    User.findOne({email: req.params.email}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/delete/:email',VerifyToken, function (req, res) {
    if (req.params.email) {
        User.findOneAndRemove(req.params.email, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
          res.status(200).send("User: "+ user.email +" was deleted.");
        }); 
    }
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/update/:email',VerifyToken, function (req, res) {
    User.findOneAndUpdate(req.params.email, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports=router;
