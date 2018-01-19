var config=require('./config.json');
var jwt=require('jsonwebtoken');

function verifyToken(req, res, next) {

 var token= req.body.token || req.cookies['JWT_SECRET'] || req.headers['x-access-token'];
 if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)  return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
     req.userId = decoded._id;
     req.userRole = decoded.role;
     next();
  });
};

module.exports=verifyToken;