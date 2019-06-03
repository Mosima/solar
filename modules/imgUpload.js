'use strict';
const storage = require('@google-cloud/storage');
const fs = require('fs')

const gcs = storage({
  projectId: 'api-project-88418002742',
  keyFilename: './API Project-52028a9694cc.json'
});
let ImgUpload = {};

const bucketName = 'diski99'
const bucket = gcs.bucket(bucketName);

 ImgUpload.getPublicUrl = function(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}



ImgUpload.uploadToGcs = (req, res, next) => {
    //console.log(req.file);
  if(!req.file) {return next();}

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = ImgUpload.getPublicUrl(gcsname);
      next();
    });
  });

  stream.end(req.file.buffer);
}

module.exports = ImgUpload;
