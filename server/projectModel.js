var mongoose = require('mongoose');


var fileSchema = new mongoose.Schema({
    label: { type: String, required: true },
    tag: String
});


var projectSchema = new mongoose.Schema({
    label: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    domain: { type: String, required: true },
    client: { type: String, required: true },
    type: String,
    inputs: [fileSchema],
    models: [fileSchema],
    outputs: [fileSchema]
});

mongoose.model('Project', projectSchema);
mongoose.model('File', fileSchema);

module.exports = {
    Project: mongoose.model('Project'),
    File: mongoose.model('File')
};
