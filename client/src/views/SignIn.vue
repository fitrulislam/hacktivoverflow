<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <span v-if="status == false">Wrong Username/Password</span>
              <v-toolbar dark color="danger">
                <v-toolbar-title>Hacktiv Overflow Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <router-link to="/" style="color: white;">Back To Home</router-link>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="username" type="text" v-model="username"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="danger" block :disabled="allOk" @click="signin">Login</v-btn>
              </v-card-actions>
              <v-card-actions>
                <p class="text-xs-center" align-content-center>Don't have account yet? <router-link to="/signup">Sign Up</router-link> now!</p>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'signin',
  data () {
    return {
      username: '',
      password: '',
      usernameStatus: false,
      passwordStatus: false,
      status: true
    }
  },
  watch: {
    username: function (val) {
      if (this.username.length > 0) {
        this.usernameStatus = true
      } else {
        this.usernameStatus = false
      }
    },
    password: function (val) {
      if (this.password.length > 0) {
        this.passwordStatus = true
      } else {
        this.passwordStatus = false
      }
    }
  },
  computed: {
    allOk: function () {
      if (this.usernameStatus === true && this.passwordStatus === true) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    signin () {
      axios.post('http://user-api.roarized.com/api/signin', {
        username: this.username,
        password: this.password
      })
        .then(response => {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('status', 'connected')
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
          this.status = false
          this.username = ''
          this.password = ''
          this.usernameStatus = false
          this.passwordStatus = false
        })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  justify-content: center;
}
.container .form {
  align-self: center;
  width: 400px;
}
.container .form label {
  text-align: left;
}
span {
  color: red;
}
</style>
