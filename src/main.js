// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'vuetify/dist/vuetify.min.css'
import store from './store/'
global.store = store
// import helper from './helper/'
// global.helper = helper

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
  // created () {
  //   // this.$http.get('/users/1').then(({data}) => console.log(data))
  //   global.$t = this.$t
  //   // fetch menu from server
  //   this.$http.get('/menu').then(({data}) => {
  //     this.$store.commit('setMenu', data)
  //   })
  //   this.$store.dispatch('checkPageTitle', this.$route.path)
  //   this.$store.dispatch('checkAuth')
  // }
})
