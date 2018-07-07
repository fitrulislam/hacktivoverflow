import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: [],
    question: {}
  },
  getters: {

  },
  mutations: {
    addQuestionFromDB (state, payload) {
      state.questions = payload
    },
    addOneQuestion (state, payload) {
      let upvote = payload.upVotes.length
      let downvote = payload.downVotes.length
      let totalVote = upvote - downvote
      payload.answers.forEach(answer => {
        let aUpvote = answer.upVotes.length
        let aDownvote = answer.downVotes.length
        let aTotal = aUpvote - aDownvote
        answer.totalVote = aTotal
      })
      state.question = {
        _id: payload._id,
        title: payload.title,
        content: payload.content,
        userName: payload.userName,
        answers: payload.answers,
        comments: payload.comments,
        upVotes: payload.upVotes,
        downVotes: payload.downVotes,
        totalVote: totalVote
      }
    },
    signout () {
      localStorage.removeItem('status')
      localStorage.removeItem('token')
      location.replace('/')
    },
    addNewQuestion (state, payload) {
      state.questions.push(payload)
    },
    editQuestion (state, payload) {
      state.questions.forEach(question => {
        if (question._id === payload[1]) {
          question.title = payload[0].title
          question.content = payload[0].content
        }
      })
    },
    addCommentForQuestion (state, payload) {
      state.question.comments.push(payload)
    },
    addAnswerFromDB (state, payload) {
      let upvote = payload.upVotes.length
      let downvote = payload.downVotes.length
      let totalVote = upvote - downvote
      state.question.answers.push({
        _id: payload._id,
        content: payload.content,
        userName: payload.userName,
        comments: payload.comments,
        totalVote: totalVote
      })
    },
    addCommentForAnswer (state, payload) {
      state.question.answers.forEach(answer => {
        if (answer._id === payload[1]) {
          answer.comments.push(payload[0])
        }
      })
    },
    questionVote (state, payload) {
      if (payload.command === 'plus') {
        let count = 0
        state.question.downVotes.forEach(one => {
          if (one === payload.voteId) {
            count++
          }
        })
        if (count === 0) {
          let countAgain = 0
          state.question.upVotes.forEach(one => {
            if (one === payload.voteId) {
              countAgain++
            }
          })
          if (countAgain === 0) {
            state.question.upVotes.push(payload.voteId)
            state.question.totalVote = state.question.upVotes.length - state.question.downVotes.length
          } else {
            let newArray = state.question.upVotes.filter(upvote => upvote !== payload.voteId)
            state.question.upVotes = newArray
            state.question.totalVote = state.question.upVotes.length - state.question.downVotes.length
          }
        }
      } else {
        let count = 0
        state.question.upVotes.forEach(one => {
          if (one === payload.voteId) {
            count++
          }
        })
        if (count === 0) {
          let countAgain = 0
          state.question.downVotes.forEach(one => {
            if (one === payload.voteId) {
              countAgain++
            }
          })
          if (countAgain === 0) {
            state.question.downVotes.push(payload.voteId)
            state.question.totalVote = state.question.upVotes.length - state.question.downVotes.length
          } else {
            let newArray = state.question.downVotes.filter(downvote => downvote !== payload.voteId)
            state.question.downVotes = newArray
            state.question.totalVote = state.question.upVotes.length - state.question.downVotes.length
          }
        }
      }
    },
    answerVote (state, payload) {
      state.question.answers.forEach(answer => {
        if (answer._id === payload.id) {
          if (payload.command === 'plus') {
            let count = 0
            answer.downVotes.forEach(one => {
              if (one === payload.voteId) {
                count++
              }
            })
            if (count === 0) {
              let countAgain = 0
              answer.upVotes.forEach(one => {
                if (one === payload.voteId) {
                  countAgain++
                }
              })
              if (countAgain === 0) {
                answer.upVotes.push(payload.voteId)
                answer.totalVote = answer.upVotes.length - answer.downVotes.length
              } else {
                let newArray = answer.upVotes.filter(upvote => upvote !== payload.voteId)
                answer.upVotes = newArray
                answer.totalVote = answer.upVotes.length - answer.downVotes.length
              }
            }
          } else {
            let count = 0
            answer.upVotes.forEach(one => {
              if (one === payload.voteId) {
                count++
              }
            })
            if (count === 0) {
              let countAgain = 0
              answer.downVotes.forEach(one => {
                if (one === payload.voteId) {
                  countAgain++
                }
              })
              if (countAgain === 0) {
                answer.downVotes.push(payload.voteId)
                answer.totalVote = answer.upVotes.length - answer.downVotes.length
              } else {
                let newArray = answer.downVotes.filter(downvote => downvote !== payload.voteId)
                answer.downVotes = newArray
                answer.totalVote = answer.upVotes.length - answer.downVotes.length
              }
            }
          }
        }
      })
    },
    deleteQuestion (state, payload) {
      let newArray = []
      state.questions.forEach(question => {
        if (question._id !== payload) {
          newArray.push(question)
        }
      })
      state.questions = newArray
    }
  },
  actions: {
    addQuestionFromDB ({commit}) {
      axios.get('http://server-hacktiv.roarized.com/question/readall')
        .then(response => {
          commit('addQuestionFromDB', response.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addOneQuestion ({commit}, payload) {
      axios.get('http://server-hacktiv.roarized.com/question/readbyid/' + payload)
        .then(response => {
          commit('addOneQuestion', response.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addQuestionForAccount ({commit}) {
      axios.get('http://server-hacktiv.roarized.com/question/readforaccount', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          commit('addQuestionFromDB', response.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addQuestionToDB ({commit}, payload) {
      axios.post('http://server-hacktiv.roarized.com/question/create', payload, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          commit('addNewQuestion', response.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    editQuestion ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.put(`http://server-hacktiv.roarized.com/question/updateq/${payload[1]}`, payload[0], {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addCommentForQuestion ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.put(`http://server-hacktiv.roarized.com/question/updatec/${payload[1]}`, payload[0], {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
                commit('addCommentForQuestion', {
                  username: response.data.data,
                  comment: payload[0].comment
                })
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addAnswerToDB ({commit}, payload) {
      axios.post('http://server-hacktiv.roarized.com/answer/create', payload, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          commit('addAnswerFromDB', response.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    addCommentForAnswer ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.put(`http://server-hacktiv.roarized.com/answer/updatec/${payload[1]}`, payload[0], {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
                commit('addCommentForAnswer', [{
                  username: response.data.data,
                  comment: payload[0].comment
                }, payload[1]])
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    questionVote ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.put(`http://server-hacktiv.roarized.com/question/updatev/${payload.id}`, {
              command: payload.command
            }, {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
                commit('questionVote', {
                  command: payload.command,
                  voteId: response.data.data
                })
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    answerVote ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.put(`http://server-hacktiv.roarized.com/answer/updatev/${payload.id}`, {
              command: payload.command
            }, {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
                commit('answerVote', {
                  id: payload.id,
                  command: payload.command,
                  voteId: response.data.data
                })
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteQuestion ({commit}, payload) {
      axios.post('https://user-api.roarized.com/api/validateuser', {}, {
        headers: {token: localStorage.getItem('token')}
      })
        .then(response => {
          if (response.data.message === 'silahkan lanjut') {
            axios.delete(`http://server-hacktiv.roarized.com/question/delete/${payload}`, {}, {
              headers: {
                token: localStorage.getItem('token')
              }
            })
              .then(response => {
                commit('deleteQuestion', payload)
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
