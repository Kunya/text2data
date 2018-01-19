var mongoose = require('mongoose');  
var bcrypt=require('bcrypt');


var UserSchema = new mongoose.Schema({  
  email: {type:String, required: true, unique: true},
  password: {type:String, required: true},
  Token: String,
  role: String, // Define access level: Admin, Domain (company), Client, project
  accessTo: [String],
  tags: [String]
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');

//add user
//login
//add project
//upload files
//excel 
//actual work: lemmer, [grammar], spark
//admin tab to manage policy