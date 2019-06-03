var Post = require('../models/post.model');
var Comment = require('../models/comment.model');
var User = require('../models/user.model');


module.exports = function (router, async) {
  router.get('/api/post', function (req, res, next) {
    Post.find()
      .populate('owner')
      .populate('comments')
      .sort('-createdAt')
      .exec(function (err, posts) {
        if (err) { return next(err); }
      res.json({data: posts });
    
      });
  });
  router.get('/api/post/user/all', function (req, res, next) {
    Post.find({owner: req.user._id})
      .populate('owner')
      .populate('comments')
      .sort('-createdAt')
      .exec(function (err, posts) {
        if (err) { return next(err); }

      res.json({data: posts });
      });
  });
  router.get('/api/post/user/:id', function (req, res, next) {
    Post.find({ owner: req.params.id })
      .populate('owner')
      .populate('comments')
      .exec(function (err, posts) {
        if (err) { return next(err); }

        res.json(posts);
      });
  });

  router.post('/api/post/new',multer.single('file'), imgUpload.uploadToGcs, function (req, res, next) {
    if(req.file.cloudStoragePublicUrl){
    async.waterfall([
      function (callback) {
        var new_post = new Post();
        var owner = req.user;
        new_post.postBody = req.body.postBody;
        new_post.owner = owner;
        new_post.save(function (err) {
          if (err) { return next(err);
          }else{

          }
          callback(null, new_post);
        });
      },
      function (post,callback) {
        User.findById({ _id: post.owner._id }, function (err, user) {
          if (err) { return next(err); }
          user.posts.push(post._id);
          user.save(function (err) {
            if (err) { return next(err); }
            res.json({ info: "Post created" });
          });
        });
      }
    ]);
  }else{
    res.status(500).json({response: "cannot upload to GCS"})
  }

  });
  router.post('/api/post/update/:id', function (req, res, next) {
    Post.findById({ _id: req.params.id }, function (err, post) {
      if (err) { return next(err); }
      _.merge(post, req.body);
      post.save(function (err) {
        if (err) { return next(err); }
       res.json({ info: "Post updated" });
      });
    });
  });
  router.post('/api/post/comment/:id', function (req, res, next) {
    async.waterfall([
      function (callback) {
        new_comment = new Comment();
       console.log(req.commentBody);
        new_comment.commentBody = req.body.commentBody;
        new_comment.owner=req.user;
        new_comment.post = req.params.id;

        new_comment.save(function (err) {
          if (err) { return next(err); }
          callback(null, new_comment);
        });
      },
      function (new_comment, callback) {
        Post.findById({ _id: new_comment.post }, function (err, post) {
          if (err) { return next(err); }
          if (post.comments.indexOf(new_comment._id) >= 0) {
            res.json({ info: "Comment already added" });
          } else {
            post.comments.push(new_comment._id)

            post.save(function (err) {
              if (err) { return next(err); }
              res.json({ info: "Comment added" });
            });
          }
        });
      }
    ]);
  });
  router.get('/api/post/like/:id', function (req, res, next) {
    Post.findById({ _id: req.params.id }, function (err, post) {
      if (err) { return next(err); }
      if (post.likes.indexOf(req.user._id) >= 0) {
        post.likes.splice(post.likes.indexOf(req.user._id), 1);
        post.save(function (err) {
          if (err) { return next(err); }
          res.json({info:'disliked'});
        });
      } else {
        post.likes.push(req.user._id);
        post.save(function (err) {
          if (err) { return next(err); }
          res.json({info:'liked'});
        });
      }
    });
  });
  router.post('/api/post/delete/:id', function (req, res, next) {
    async.waterfall([
      function (callback) {
        Post.findById({ _id: req.params.id }, function (err, post) {
          if (err) { return next(err); }
          callback(null, post);
        });
      },
      function (post, callback) {
        User.findById({ _id: post.owner }, function (err, user) {
          if (err) { return next(err) }
          user.posts.splice(user.posts.indexOf(req.params.id), 1);
          user.save(function (err) {
            if (err) { return next(err); }
            callback();
          });
        });
      },
      function (callback) {
        Post.findByIdAndRemove({ _id: req.params.id }, function (err) {
          if (err) { return next(err); }
          res.json({ info: "Post removed" });
        });
      }
    ]);

  });
}
