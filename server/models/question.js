const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema ({
  title: String,
  content: String,
  userName: String,
  userId: String,
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  comments: Array,
  upVotes: Array,
  downVotes: Array
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
