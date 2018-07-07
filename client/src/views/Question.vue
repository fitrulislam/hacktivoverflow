<template>
  <v-app light>
    <v-toolbar color="danger" dark flat fixed app>
      <v-icon>fas fa-question</v-icon>
      <v-toolbar-title class="back" @click="backToHome">Hacktiv OverFlow</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat color="white" @click="signout">Sign Out</v-btn>
    </v-toolbar>
    <v-content>
      <v-flex>
        <v-list two-line>
          <h2>&nbsp;&nbsp;&nbsp;My Question</h2>
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
            <v-btn small color="primary" dark @click="addData(question._id)" @click.stop="dialog = true">Edit</v-btn>
            <v-btn small color="error" dark @click="deleteData(question._id)">Delete</v-btn>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-flex>
      <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
          <v-card-title>
            Edit Question
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="title" type="text" v-model="detailTitle"></v-text-field>
              <v-text-field label="content" type="text" v-model="detailContent" multi-line></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog = false">Close</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="editQuestion" @click.stop="dialog = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'myquestion',
  data () {
    return {
      detailTitle: '',
      detailContent: '',
      detailId: '',
      dialog: false
    }
  },
  computed: {
    questions () {
      return this.$store.state.questions
    }
  },
  methods: {
    addData (id) {
      axios.get(`http://server-hacktiv.roarized.com/question/readbyid/${id}`, {
        token: localStorage.getItem('token')
      })
        .then(response => {
          this.detailTitle = response.data.data.title
          this.detailContent = response.data.data.content
          this.detailId = response.data.data._id
        })
        .catch(err => {
          console.log(err)
        })
    },
    editQuestion () {
      let forEdit = [{
        title: this.detailTitle,
        content: this.detailContent
      }, this.detailId]
      this.$store.commit('editQuestion', forEdit)
      this.$store.dispatch('editQuestion', forEdit)
    },
    deleteData (id) {
      this.$store.dispatch('deleteQuestion', id)
    },
    tes () {
    },
    backToHome () {
      this.$router.push('/')
    },
    signout () {
      this.$store.commit('signout')
    }
  },
  created: function () {
    this.$store.dispatch('addQuestionForAccount')
  }
}
</script>

<style>

</style>
