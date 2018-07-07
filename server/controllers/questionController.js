const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = {
  create: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    let obj = {
      title: req.body.title,
      content: req.body.content,
      userName: decoded.username,
      userId: decoded.id,
      answers: [],
      comments: [],
      upVotes: [],
      downVotes: []
    };
    const newQuestion = new Question(obj);
    newQuestion.save()
      .then(question => {
        res.status(201).json({
          message: 'question created',
          data: question
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  readall: (req,res) => {
    Question.find()
      .then(questions => {
        res.status(200).json({
          message: 'this is all q data',
          data: questions
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  readbyid: (req,res) => {
    Question.findOne({
      _id: req.params.id
    })
      .populate('answers')
      .then(questions => {
        res.status(200).json({
          message: 'question by id',
          data: questions
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'something went wrong'
        });
      })
  },
  updateQ: (req,res) => {
    Question.update({
      _id: req.params.id
    },{
      $set: req.body
    })
      .then(question => {
        res.status(200).json({
          message: 'data updated',
          data: question
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'something went wrong'
        });
      })
  },
  updateC: (req,res) => {
    Question.find({
      _id: req.params.id
    })
      .then(question => {
        let decoded = jwt.verify(req.headers.token, secret);
        let objComment = {
          username: decoded.username,
          comment: req.body.comment
        };
        let array = question[0].comments;
        array.push(objComment);
        Question.update({
          _id: req.params.id
        }, {
          comments: array
        })
          .then(question => {
            res.status(200).json({
              message: 'comment added',
              data: decoded.username
            });
          })
          .catch(err => {
            res.status(500).json({
              message: 'something went wrong'
            });
          })
      })
      .catch(err => {
        res.status(500).json({
          message: 'something went wrong'
        });
      })
  },
  updateV: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    Question.findOne({
      _id: req.params.id
    })
      .then(question => {
        if(req.body.command == 'plus') {
          let count = 0;
          question.downVotes.forEach(one => {
            if (one == decoded.id) {
              count++;
            }
          })
          if (count == 0) {
            let countAgain = 0;
            question.upVotes.forEach(one => {
              if (one == decoded.id) {
                countAgain++;
              };
            });
            if (countAgain == 0) {
              question.upVotes.push(decoded.id)
            } else {
              let newArray = question.upVotes.filter(upvote => upvote !== decoded.id);
              question.upVotes = newArray;
            }
            Question.update({
              _id: req.params.id
            }, {
              upVotes: question.upVotes
            })
              .then(response => {
                res.status(200).json({
                  message: 'upvote!',
                  data: decoded.id
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'something went wrong'
                });
              })
          } else {
            res.status(200).json({
              message: 'upvote!',
              data: decoded.id
            });
          }
        } else {
          let count = 0;
          question.upVotes.forEach(one => {
            if (one == decoded.id) {
              count++;
            };
          });
          if (count == 0) {
            let countAgain = 0;
            question.downVotes.forEach(one => {
              if (one == decoded.id) {
                countAgain++;
              };
            });
            if (countAgain == 0) {
              question.downVotes.push(decoded.id);
            } else {
              let newArray = question.downVotes.filter(downvote => downvote !== decoded.id);
              question.downVotes = newArray;
            }
            Question.update({
              _id: req.params.id
            }, {
              downVotes: question.downVotes
            })
              .then(response => {
                res.status(200).json({
                  message: 'downvote!',
                  data: decoded.id
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'something went wrong'
                });
              })
          } else {
            res.status(200).json({
              message: 'downvote!',
              data: decoded.id
            });
          }
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  readforaccount: (req,res) => {
    let decoded = jwt.verify(req.headers.token, secret);
    Question.find({
      userId: decoded.id
    })
      .then(questions => {
        res.status(200).json({
          message: 'all data',
          data: questions
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'server error'
        });
      })
  },
  delete: (req,res) => {
    Question.findByIdAndRemove({
      _id: req.params.id
    })
    .then(question => {
      res.status(200).json({
        message: `q deleted`,
        data: question
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `server error`
      });
    })
  }
};
