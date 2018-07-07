<template>
  <v-app light>
    <v-toolbar color="danger" dark flat fixed app>
      <v-icon>fas fa-question</v-icon>
      <v-toolbar-title class="back" @click="backToHome">Hacktiv OverFlow</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="status == false" flat color="white" @click="toLogin">Sign In</v-btn>
      <v-btn v-show="status == true" flat color="white" @click.stop="dialog = true">Add Article</v-btn>
      <v-btn v-show="status == true" flat color="white" @click="toMyQ">My Question</v-btn>
      <v-btn v-show="status == true" flat color="white" @click="signout">Sign Out</v-btn>
    </v-toolbar>
    <v-content>
      <v-flex>
        <v-list two-line>
          <h2>&nbsp;&nbsp;&nbsp;Question List</h2>
          <div v-for="(question, index) in questions" :key="index">
            <router-link :to="{ name: 'questionDetail', params: {id: question._id, question} }" style="color: black;">
              <v-list-tile @click="tes">
                <v-list-tile-avatar>
                  <img src="https://image.freepik.com/free-icon/question-mark_318-52837.jpg">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ question.title }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ question.content.slice(0,30) }}...</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-flex>
    </v-content>>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="danger">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Add Question</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="title" type="text" v-model="title"></v-text-field>
              <v-text-field multi-line rows="10" label="content" type="text" v-model="content"></v-text-field>
              <v-layout row justify-center>
                <v-btn color="danger" :disabled="allOk" @click="addData">Add Article</v-btn>
              </v-layout>
            </v-form>
          </v-card-text>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
  </v-app>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      title: '',
      content: '',
      titleStatus: false,
      contentStatus: false,
      status: false,
      dialog: false
    }
  },
  watch: {
    title: function (val) {
      if (val.length > 0) {
        this.titleStatus = true
      }
    },
    content: function (val) {
      if (val.length > 0) {
        this.contentStatus = true
      }
    }
  },
  computed: {
    questions () {
      return this.$store.state.questions
    },
    allOk () {
      if (this.titleStatus === true && this.contentStatus === true) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    addData () {
      let obj = {
        title: this.title,
        content: this.content
      }
      this.$store.dispatch('addQuestionToDB', obj)
      this.title = ''
      this.content = ''
      this.dialog = false
    },
    tes () {
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
      this.status = false
    }
  },
  created: function () {
    this.$store.dispatch('addQuestionFromDB')
    let status = localStorage.getItem('status')
    if (status === 'connected') {
      this.status = true
    }
  }
}
</script>

<style>
.back:hover {
  cursor: pointer;
}
</style>
