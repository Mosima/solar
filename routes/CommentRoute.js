var Comment = require('../models/comment.model');
var Post = require('../models/post.model');
var Owner = require('../models/user.model');


module.exports = function(router){
    router.get('/api/comment', function(req, res, next){
        Comment
        .find()
        .populate('owner')
        .sort('-createdAt')
        .exec(function(err, comments){
            if(err){return next(err);}
            res.json({info: "success", data: comments});
        });
    });

    router.get('/api/comment/:id', function(req, res, next){
        Comment
        .findById({_id: req.params.id})
        .populate('owner')
        .populate('post')
        .exec(function(err, comment){
            if(err){return next(err);}
            res.json({info: "success", data: comment});
        });
    });
    router.post('/api/comment', function(req,res ,next)
    {
        var new_comment = new Comment();

         new_comment.body = req.body.comment_body;
        new_comment.owner = req.body.user;
        new_comment.post.push(req.body.post_id);

        new_comment.save(function(err)
        {
            if(err){ return next(err);}
            res.json({response: "Comment added"});
        });

    });
}
