const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema ({
  content: String,
  userName: String,
  comments: Array,
  upVotes: Array,
  downVotes: Array
}, {
  timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
