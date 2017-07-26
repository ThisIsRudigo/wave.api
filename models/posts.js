var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

// likes and dislike schema
var actionSchema = new Schema({

    likes: [{type: mongoose.Schema.Types.ObjectId,
             ref: 'User'}],

    dislikes: [{type: mongoose.Schema.Types.ObjectId,
                ref: 'User'}]

}, {
    timestamps: true
});

//user comments schema
var commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },

   action:[actionSchema],

   postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// post schema
var postSchema = new Schema({
    idea :{
        type : String,
        required : true
    },
    likes : [{ type: Schema.ObjectId, ref: 'User'}],

    dislikes : [{ type: Schema.ObjectId, ref: 'User'}],

    comments: [commentSchema],

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;