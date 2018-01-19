var mongoose = require('mongoose');


var JobSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
  registered: Date,
  finished: Date,
  jobType: String,
  status: String,
  details: String
});


mongoose.model('Jog', JobSchema);
module.exports = mongoose.model('Jog');
