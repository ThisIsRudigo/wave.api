var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');
var Posts = require('../models/posts');

var router = express.Router();
router.use(bodyParser.json());
router.route('/')

    // gets all post in database
.get(Verify.verifyOrdinaryUser, function (req,res) {

    Posts.find({})
        .populate('comments.postedBy')
        .exec(function(err, post) {
        if (err) throw err;
        res.json(post);
    });
})

// creating new post to database
.post(Verify.verifyOrdinaryUser, function (req, res) {

    req.body.postedBy = req.decoded._doc._id;

    Posts.create(req.body, function (err, post) {
        if (err) throw err;

       

        console.log('post added successful');
        var id = post._id;
        res.writeHead(200,{
            'content-Type': 'text/plain'
        });
        res.end(' post ID : '+ id);

    });
})

.delete (Verify.verifyOrdinaryUser, function (req,res) {

    Posts.remove({},function(err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.route('/:PostsId')

//gets post with specific id
.get(Verify.verifyOrdinaryUser, function (req,res) {

    Posts.findById(req.params.PostsId)
        .populate('postedBy','comments.postedBy')
        .exec( function(err, post) {
        if (err) throw err;

        res.json(post);
    });
})

// edit/update a post with specific id

.put(Verify.verifyOrdinaryUser, function (req, res) {

    Posts.findByIdAndUpdate(req.params.PostsId, {
        $set: req.body
    },{
        new: true
    }, function (err, post) {
        if (err) throw err;

        res.json(post);
    });


})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {

    Posts.remove(req.params.PostsId, function (err, post) {

        if (post.id(req.params.postId).postedBy
            != req.decoded._doc._id){

            var err = new Error('you re not authorized');
            err.status = 403;
            return next(err);
        }
        res.json(resp);

    })
});

// router.route('/:PostsId/action')
//
//     .get(function (req,res) {
//
//         Posts.findById(req.params.PostsId, function(err, post) {
//             if (err) throw err;
//
//             res.json(post.comments);
//         });
//     })
//
//     //    posting a new comment to a post
//     .post(function (req, res) {
//
//         Posts.findById(req.params.PostsId, function (err, post) {
//
//             if (err) throw err;
//             post.comments.push(req.body);
//
//             post.save(function (err, post) {
//                 if (err) throw err;
//
//                 res.json(post)
//             });
//         });
//     })
//
//     .delete(function (req, res) {
//
//         Posts.findById(req.params.PostsId, function (err, post) {
//             if (err) throw err;
//
//             for (var i = (post.comments.length - 1); i>= 0; i--){
//                 post.id(post[i]._id).remove();
//             }
//
//             post.save(function (err, result) {
//                 if (err) throw err;
//
//                 res.writeHead(200, {
//                     'content-Type': 'text/plain'
//                 });
//                 res.end('delete all comments')
//             });
//         });
//     });


router.route('/:PostsId/comments')
.all(Verify.verifyOrdinaryUser)

.get(function (req,res) {

    Posts.findById(req.params.PostsId)
        .populate('postedBy','comments.postedBy')
        .exec( function(err, post) {
        if (err) throw err;

        res.json(post.comments);
    });
})

//    posting a new comment to a post
.post(function (req, res) {

    Posts.findById(req.params.PostsId, function (err, post) {

        if (err) throw err;

        req.body.postedBy = req.decoded._doc._id;

        post.comments.push(req.body);

        post.save(function (err, post) {
            if (err) throw err;

            res.json(post)
        });
    });
})

.delete(Verify.verifyAdmin,function (req, res) {

    Posts.findById(req.params.PostsId, function (err, post) {
        if (err) throw err;

        for (var i = (post.comments.length - 1); i>= 0; i--){
            post.id(post[i]._id).remove();
        }

        post.save(function (err, result) {
            if (err) throw err;

            res.writeHead(200, {
                'content-Type': 'text/plain'
            });
            res.end('delete all comments')
        });
    });
});


router.route('/:PostsId/comments/:commentsId')
.all(Verify.verifyOrdinaryUser)
.get(function (req,res) {

    Posts.findById(req.params.PostsId)
        .populate('comments.postedBy')
        .exec( function(err, post) {
        if (err) throw err;

        res.json(post.comments.id(req.params.comments));
    });
})

.put(function (req, res) {

    Posts.findById(req.params.PostsId, function(err, post){
        if (err) throw err;

        post.comments.id(req.params.comments).remove();

        req.body.postedBy = req.decoded._doc._id;

        post.comments.push(req.body);

        post.save(function (err, post) {
            if (err) throw err;
            console.log('Updated trip information');
            console.log(post);

            res.json(post);
        });
    });
})

.delete(function (req, res, next) {

    Posts.findById(req.params.PostsId, function (err, post) {

        if (post.comments.id(req.params.commentId).postedBy
            != req.decoded._doc._id){

            var err = new Error('you re not authorized');
            err.status = 403;
            return next(err);
        }
        post.comments.id(req.params.comments).remove();

        post.save(function (err, resp) {
            if (err) throw err;

            res.json(resp);
        });
    });
});


module.exports = router;
