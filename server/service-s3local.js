var config = require('./config.json');
var yazl = require("yazl");
var S3FS = require('s3fs');
var fs = new S3FS(config.s3.bucket, config.s3.options);
var fslocal = require("fs");
var path = require("path");

const Queue = require('bee-queue');
//const s3Local = new Queue('s3local', { removeOnSuccess: true });


// TESTING

function test() {

    var data = { s3local: {} };
    
    
    data.s3local.from = 'ipsos-data/_1000900830.jpg';
    data.s3local.to='home/app/_1000900830.jpg';
    data.s3local.action='download';
    
    var job={data:data};
    brozzy(job,(x,y)=>{consolge.log(x + ". Data=" + y)}));
     
    /*const thatQueue = new Queue("s3local", { removeOnSuccess: true });

    const job = thatQueue.createJob(data);
    job.on('failed', (err) => { console.log(err); });
    job.on('succeeded', (result) => { console.log(result); });
    job.save().then(() => { console.log("Job was added."); }).catch(function(err) { console.log(err); });
    */
}


//s3Local.process(function
function brozzy(job, done) {
    var data=job.data.s3local;
    if (!data) return done(new Error('S3-local service: no data provided.'));

    switch (data.action) {
        case 'upload':
          var strm=fslocal.createReadStream(data.from)
          strm.on("end",()=>{done(null)});
          strm.pipe(fs.createWriteStream(data.to));
          break;
        case 'download':
          var strm=fs.createReadStream(data.from);
          strm.on("end",()=>{done(null)});
          strm.pipe(fslocal.createWriteStream(data.to);
          break;
        default: return done(new Error('S3-local service: missing or unknown "action" parameter. Expect "download" or "upload".'));
      }
    
});


test();

