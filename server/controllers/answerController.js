const Answer = require('../models/answer.js');
const Question = require('../models/question.js');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = {
  create: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    let obj = {
      content: req.body.content,
      userId: decoded.id,
      userName: decoded.username,
      comments: [],
      upVotes: [],
      downVotes: []
    };
    const newAnswer = new Answer(obj);
    newAnswer.save()
      .then(answer => {
        Question.findOne({
          _id: req.body.qId
        })
          .then(question => {
            let answers = question.answers;
            answers.push(answer._id);
            Question.update({
              _id: req.body.qId
            }, {
              answers: answers
            })
              .then(question => {
                res.status(201).json({
                  message: 'answer created',
                  data: answer
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'something went wrong'
                });
              })
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'something went wrong'
        });
      })
  },
  readAll: (req,res) => {
    Answer.find()
      .then(answers => {
        res.status(200).json({
          message: 'all answer',
          data: answers
        });
      })
      .catch(err => {
        res.status(404).json({
          message: 'answer not found'
        });
      })
  },
  updateC: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    Answer.findOne({
      _id: req.params.id
    })
      .then(answer => {
        let array = answer.comments;
        array.push({
          username: decoded.username,
          comment: req.body.comment
        });
        Answer.update({
          _id: req.params.id
        }, {
          comments: array
        })
          .then(answer => {
            res.status(200).json({
              message: 'comment added',
              data: decoded.username
            });
          })
          .catch(err => {
            res.status(500).json({
              message: 'server error'
            });
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  updateV: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    Answer.findOne({
      _id: req.params.id
    })
      .then(answer => {
        if(req.body.command == 'plus') {
          let count = 0;
          answer.downVotes.forEach(one => {
            if (one == decoded.id) {
              count++;
            }
          });
          if (count == 0) {
            let countAgain = 0;
            answer.upVotes.forEach(one => {
              if (one == decoded.id) {
                countAgain++;
              }
            });
            if (countAgain == 0) {
              answer.upVotes.push(decoded.id);
            } else {
              let newArray = answer.upVotes.filter(upvote => upvote !== decoded.id);
              answer.upVotes = newArray;
            }
            Answer.update({
              _id: req.params.id
            }, {
              upVotes: answer.upVotes
            })
              .then(response => {
                res.status(200).json({
                  message: 'upvote!'
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'something went wrong'
                });
              })
          }
        } else {
          let count = 0;
          answer.upVotes.forEach(one => {
            if (one == decoded.id) {
              count++;
            }
          });
          if (count == 0) {
            let countAgain = 0;
            answer.downVotes.forEach(one => {
              if (one == decoded.id) {
                countAgain++;
              }
            });
            if (countAgain == 0) {
              answer.downVotes.push(decoded.id);
            } else {
              let newArray = answer.downVotes.filter(downvote => downvote !== decoded.id);
              answer.downVotes = newArray;
            }
            Answer.update({
              _id: req.params.id
            }, {
              downVotes: answer.downVotes
            })
              .then(response => {
                res.status(200).json({
                  message: 'downvote!'
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'something went wrong'
                });
              })
          }
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  delete: (req,res) => {
    Answer.findByIdAndRemove({
      _id: req.params.id
    })
    .then(answer => {
      res.status(200).json({
        message: `a deleted`,
        data: answer
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `server error`
      });
    })
  }
};
