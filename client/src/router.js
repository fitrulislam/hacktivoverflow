import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SignIn from './views/SignIn.vue'
import SignUp from './views/SignUp.vue'
import QuestionDetail from './views/QuestionDetail.vue'
import MyQuestion from './views/Question.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/questionDetail/:id',
      name: 'questionDetail',
      component: QuestionDetail,
      props: true
    },
    {
      path: '/myquestion',
      name: 'myquestion',
      component: MyQuestion
    }
  ]
})
