<template>
  <v-app light>
    <v-toolbar color="danger" dark flat fixed app>
      <v-icon>fas fa-question</v-icon>
      <v-toolbar-title class="back" @click="backToHome">Hacktiv OverFlow</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="status == false" flat color="white" @click="toLogin">Sign In</v-btn>
      <v-btn v-show="status == true" flat color="white" @click="toMyQ">My Question</v-btn>
      <v-btn v-show="status == true" flat color="white" @click="signout">Sign Out</v-btn>
    </v-toolbar>
    <v-content>
      <v-layout column wrap>
        <v-container>
          <v-layout row wrap align-center>
            <v-flex xs1 md1>
              <div class="arrow-up" @click="questionVote(question._id, 'plus')"></div>
                &nbsp;&nbsp;&nbsp;{{ question.totalVote }}
              <div class="arrow-down" @click="questionVote(question._id, 'minus')"></div>
            </v-flex>
            <v-flex xs11 md11>
              <h3>{{ question.title }}</h3>
              <h4>{{ question.content }} - {{ question.userName }}</h4>
            </v-flex>
          </v-layout><br>
          <v-layout>
            <v-flex xs1 md1>
            </v-flex>
            <v-flex xs11 md11>
              <p v-for="(comment,index) in question.comments" :key="index">
                {{ comment.comment }} - {{ comment.username }}
              </p>
              <v-form v-show="status == true" @submit.prevent="addCommentForQuestion(question._id)">
                <v-text-field label="add comment" type="text" v-model="qComment"></v-text-field>
                <button type="submit" style="display: none;">tes</button>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <div v-for="(answer, index) in question.answers" :key="index">
            <v-layout row wrap align-center>
              <v-flex xs1 md1>
                <div class="arrow-up" @click="answerVote(answer._id, 'plus')"></div>
                  &nbsp;&nbsp;&nbsp;{{ answer.totalVote }}
                <div class="arrow-down" @click="answerVote(answer._id, 'minus')"></div>
              </v-flex>
              <v-flex xs11 md11>
                <h4>{{ answer.content }} - {{ answer.userName }}</h4>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-center>
              <v-flex xs1 md1>
              </v-flex>
              <v-flex xs11 md11>
                <p v-for="(comment,index) in answer.comments" :key="index">
                  {{ comment.comment }} - {{ comment.username }}
                </p>
                <v-form v-show="status == true" @submit.prevent="addCommentForAnswer">
                  <v-text-field label="add comment" type="text" id="comment" name="aComment"></v-text-field>
                  <button type="submit" style="display: none;" @click="addAnswerId(answer._id)">tes</button>
                </v-form>
              </v-flex>
            </v-layout>
          </div>
          <v-layout v-show="status == true" row wrap align-center>
            <v-flex xs1 md1>
            </v-flex>
            <v-flex xs11 md11>
              <v-text-field
                label="add answer"
                multi-line
                v-model="answer"
              ></v-text-field>
              <v-btn small color="primary" @click="addAnswerToDB(question._id)">Add Answer</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-content>>
  </v-app>
</template>

<script>

export default {
  name: 'questionDetail',
  data () {
    return {
      status: false,
      qComment: '',
      answer: '',
      answerId: '',
      buttonStatus: false
    }
  },
  props: ['id'],
  computed: {
    question () {
      return this.$store.state.question
    }
  },
  methods: {
    tes () {
      alert('woi')
    },
    addCommentForQuestion (id) {
      this.$store.dispatch('addCommentForQuestion', [{
        comment: this.qComment
      }, id])
      this.qComment = ''
    },
    addAnswerToDB (id) {
      this.$store.dispatch('addAnswerToDB', {
        content: this.answer,
        qId: id
      })
      this.answer = ''
    },
    addAnswerId (id) {
      this.answerId = id
    },
    addCommentForAnswer (e) {
      this.$store.dispatch('addCommentForAnswer', [{
        comment: e.target.elements.aComment.value
      }, this.answerId])
    },
    questionVote (id, command) {
      this.$store.dispatch('questionVote', {id: id, command: command})
    },
    answerVote (id, command) {
      this.$store.dispatch('answerVote', {id: id, command: command})
    },
    backToHome () {
      this.$router.push('/')
    },
    toLogin () {
      this.$router.push('/signin')
    },
    toMyQ () {
      this.$router.push('/myquestion')
    },
    signout () {
      this.$store.commit('signout')
    }
  },
  created: function () {
    this.$store.dispatch('addOneQuestion', this.id)
    let status = localStorage.getItem('status')
    if (status === 'connected') {
      this.status = true
    }
  }
}
</script>

<style scoped>
.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid grey;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid grey;
}

.nav-link {
  color: white !important;
  font-weight: bold;
}

.navbar {
  margin-bottom: 15px;
}

.main-container{
  display:flex;
  flex-direction:row;
  padding-bottom: 10px;
}

.left{

  min-width:80px;
  max-width:80px;
}
</style>
