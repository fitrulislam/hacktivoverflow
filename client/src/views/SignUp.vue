<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="danger">
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <router-link to="/" style="color: white;">Back To Home</router-link>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="face"
                    label="name"
                    type="text"
                    v-model="name"
                    :rules="nameRules"
                    required>
                  </v-text-field>
                  <v-text-field
                    prepend-icon="mail"
                    label="email"
                    type="text"
                    :rules="emailRules"
                    v-model="email"
                    required>
                  </v-text-field>
                  <v-text-field
                    prepend-icon="person"
                    label="username"
                    type="text"
                    v-model="username"
                    :rules="usernameRules"
                    required>
                  </v-text-field>
                  <v-text-field
                    v-model="password"
                    prepend-icon="lock"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    label="password"
                    hint="At least 8 characters"
                    :rules="passwordRules"
                    required>
                  </v-text-field>
                  <v-text-field
                    prepend-icon="info"
                    :append-icon="e2 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e2 = !e2)"
                    :type="e2 ? 'password' : 'text'"
                    label="confirm password"
                    v-model="confirmPassword"
                    hint="Must same with password"
                    :rules="confPasswordRules"
                    required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="danger" block :disabled="allOk" @click="signup">Register</v-btn>
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
  name: 'signup',
  data () {
    return {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      nameStatus: false,
      emailStatus: false,
      usernameStatus: false,
      passwordStatus: false,
      confirmPasswordStatus: false,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
        v => (v && this.emailStatus === true) || 'Email has taken'
      ],
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length >= 8 || 'At least 8 character',
        v => (this.usernameStatus === true) || 'Username must unique'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(v) || 'Password must contain letter, number, and special case'
      ],
      confPasswordRules: [
        v => !!v || 'Confirm Password is required',
        v => this.confirmPasswordStatus === true || 'Your confirm password is not match with your password'
      ],
      e1: true,
      e2: true
    }
  },
  watch: {
    name: function (val) {
      this.validateName()
    },
    username: function (val) {
      if (val.length >= 8) {
        this.validateUsername(val)
      } else {
        this.usernameStatus = false
      }
    },
    email: function (val) {
      this.validateEmail()
    },
    password: function (val) {
      this.validatePassword(val)
    },
    confirmPassword: function (val) {
      this.validateConfirmPassword(val)
    }
  },
  computed: {
    allOk: function () {
      if (this.nameStatus === true && this.emailStatus === true && this.usernameStatus === true && this.passwordStatus === true && this.confirmPasswordStatus === true) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    validPassword (password) {
      let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
      return re.test(password)
    },
    validateEmail () {
      axios.post('http://user-api.roarized.com/api/foremailvalidate', {
        email: this.email
      })
        .then(response => {
          this.emailStatus = true
        })
        .catch(err => {
          console.log(err)
          this.emailStatus = false
        })
    },
    validateUsername (val) {
      axios.post('http://user-api.roarized.com/api/forusernamevalidate', {
        username: val
      })
        .then(response => {
          console.log('masuk')
          this.usernameStatus = true
        })
        .catch(err => {
          console.log(err)
          this.usernameStatus = false
        })
    },
    validateName () {
      if (this.name.length > 0) {
        this.nameStatus = true
      } else {
        this.nameStatus = false
      }
    },
    validatePassword (val) {
      if (this.validPassword(val) === true) {
        this.passwordStatus = true
      } else {
        this.passwordStatus = false
      }
    },
    validateConfirmPassword (val) {
      if (val === this.password) {
        this.confirmPasswordStatus = true
      } else {
        this.confirmPasswordStatus = false
      }
    },
    signup () {
      axios.post('http://user-api.roarized.com/api/signup', {
        name: this.name,
        email: this.email,
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
